import {
  HederaAccount,
  HederaEnvironment,
  NftCreated,
  NFTDto,
  TokenDto,
} from 'src/models/hedera.interface';
import { Fees } from './models/hedera.interface';
import { HederaSdk } from './sdk-hedera/hedera.sdk';
import { deleteNFT, storeMetadata, storeNFT } from './sdk-storage/storage.sdk';
import Logger from 'js-logger';
import { instanceOfNFTDto } from './utils/instanceOf';

/* Export Interfaces */
export * from './models/hedera.interface';

export enum DebugLevel {
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

Logger.useDefaults();

export class ClientNFT {
  hederaSdk: HederaSdk;
  nftStorageApiKey: string;

  constructor({
    hederaAccount,
    nftStorageApiKey,
    debugLevel,
  }: {
    hederaAccount: HederaAccount;
    nftStorageApiKey: string;
    debugLevel: DebugLevel;
  }) {
    Logger.setLevel(ClientNFT.getLogger(debugLevel));
    this.initialization({ hederaAccount, nftStorageApiKey }).catch(console.log);
  }

  async initialization({
    hederaAccount,
    nftStorageApiKey,
  }: {
    hederaAccount: HederaAccount;
    nftStorageApiKey: string;
  }) {
    Logger.info(
      'Initialization on Hedera',
      hederaAccount.environment
        ? hederaAccount.environment.toUpperCase()
        : HederaEnvironment.MAINNET,
    );
    if (!hederaAccount.accountId || !hederaAccount.privateKey) {
      Logger.error(
        'Please provide an accountID and a privateKey... Check the Usage on https://www.npmjs.com/package/@xact-wallet-sdk/nft#usage',
      );
      return Promise.reject(
        'Please we need your Account ID and private Key in order to use the Hedera SDK - https://portal.hedera.com/register',
      );
    }
    if (!nftStorageApiKey) {
      Logger.error(
        'Please provide a nftStorageApiKey... Check the Usage on https://www.npmjs.com/package/@xact-wallet-sdk/nft#usage',
      );
      return Promise.reject(
        'Please we need your Api Key in order to store your NFT on IPFS - https://nft.storage/',
      );
    }
    this.hederaSdk = new HederaSdk({
      environment: HederaEnvironment.MAINNET,
      ...hederaAccount,
    });
    this.nftStorageApiKey = nftStorageApiKey;
  }

  /**
   * Getting Fees from NFT's creation
   */
  async getFees(): Promise<Fees> {
    Logger.info('Getting fees...');
    return await this.hederaSdk.getFees();
  }

  /**
   *  Create a NFT
   * @param NFTDto | TokenDto
   */
  async createAndMint(createDto: NFTDto | TokenDto): Promise<NftCreated> {
    let tokenDto: TokenDto;
    const cids: string[] = [];
    const cidsMetadata: string[] = [];
    let supply;

    /** Convert NFTDto to TokenDto */
    if (instanceOfNFTDto(createDto)) {
      tokenDto = {
        name: createDto.name,
        customRoyaltyFee: createDto.customRoyaltyFee,
        nfts: [createDto],
      };
      supply = createDto.supply;
    } else {
      tokenDto = createDto;
    }

    for (const nft of tokenDto.nfts) {
      if (!nft.media || !nft.name || !tokenDto.name) {
        Logger.error(
          'name and medias parameters must be defined when calling this method... Check the Usage on https://www.npmjs.com/package/@xact-wallet-sdk/nft#usage',
        );
        return Promise.reject(
          'Please define at least a Media and a Name for your NFT !',
        );
      }
    }

    try {
      /* Checking the balance */
      Logger.info("Checking user's balance...");
      await this.hederaSdk.checkBalance();

      /* Storing the Media */
      Logger.info('Saving the medias and metadata on FileCoin...');
      for (const [index, nft] of tokenDto.nfts.entries()) {
        const cid = await storeNFT({
          token: this.nftStorageApiKey,
          media: nft.media,
        });

        Logger.info(
          `Media [${index}/${tokenDto.nfts.length}] saved on FileCoin.`,
        );

        cids.push(cid);

        const metadataCid = await storeMetadata({
          token: this.nftStorageApiKey,
          ...nft,
          customRoyaltyFee: tokenDto.customRoyaltyFee,
          supply: supply ?? 1,
          cid,
        });

        Logger.info(
          `Metadata [${index}/${tokenDto.nfts.length}] saved on FileCoin.`,
        );

        cidsMetadata.push(metadataCid);
      }

      /* Create the NFT */
      Logger.info('Creating the NFT on Hedera...');
      const res = await this.hederaSdk.createNFT({
        name: tokenDto.name,
        customFees: tokenDto.customRoyaltyFee,
        supply: supply,
        cids: cidsMetadata,
        nfts: tokenDto.nfts,
      });
      Logger.debug('Your NFT will be available soon on', res.urls);
      return res;
    } catch (e) {
      Logger.error('An error occurred while creating the NFT...');
      /* Remove the File from Storage if an error occurred while creating the NFT on Hedera */
      if (cids.length > 0) {
        Logger.warn('Removing your medias and metadata from FileCoin...');
        for (const [index, cid] of cids.entries()) {
          if (cidsMetadata[index]) {
            await deleteNFT({
              cid: cidsMetadata[index],
              token: this.nftStorageApiKey,
            });
          }
          await deleteNFT({ cid, token: this.nftStorageApiKey });
        }
      }
      return Promise.reject(e);
    }
  }

  private static getLogger(debugLevel: DebugLevel) {
    switch (debugLevel) {
      case 'DEBUG':
        return Logger.DEBUG;
      case 'WARN':
        return Logger.WARN;
      case 'ERROR':
        return Logger.ERROR;
      default:
        return Logger.OFF;
    }
  }
}
