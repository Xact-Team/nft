export interface HederaAccount {
    accountId: string;
    privateKey: string;
    environment?: HederaEnviroment;
}

export interface NFTDto {
    /* Name of the NFT */
    name: string;
    /* Description of the NFT */
    description: string;
    /* Category of the NFT */
    category: CategoryNFT;
    /* Creator of the NFT */
    creator: string;
    /* Media to linked to the NFT - base64 */
    media: string;
    /* Quantity of NFT to create */
    supply: number;
    /* Custom Royalty Fees  */
    customRoyaltyFee: CustomFee | null;
    /* Attributes */
    attributes: NftAttribute[];
    /* Custom JSON Properties */
    customProperties: Object | null;
}

export interface NftAttribute {
    trait_type: string;
    value: string;
}

export interface NftCreated {
    url: string;
    txId: string;
    tokenId: string;
    nftIds: Array<string>;
}


export interface CreateNFT {
    name: string,
    creator: string,
    category: CategoryNFT,
    cid: string,
    supply: number,
    customFee?: CustomFee | null
    attributes?: NFTProperties[] | null
    customProperties?: object | null;
}

export interface NFTProperties {
    trait_type: string,
    value: string
}

export interface Fees {
    hbar: number;
    usd: number;
}

export enum HederaEnviroment {
    MAINNET = "mainnet",
    TESTNET = 'testnet'
}

export enum CategoryNFT {
    ART = 'Art',
    DIGITAL_ART = 'Digital art',
    MUSIC = "Music",
    COLLECTIBLE = "Collectible",
    DOCUMENT = "Document",
    OTHER = "Other",
}

export interface CustomFee {
    numerator: number,
    denominator: number,
    fallbackFee: number,
}
