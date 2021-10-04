export interface HederaAccount {
    accountId: string;
    privateKey: string;
    environment?: HederaEnviroment;
}
export interface NFTDto {
    name: string;
    description: string;
    category: CategoryNFT;
    creator: string;
    media: string;
    supply: number;
    customRoyaltyFee: CustomFee | null;
    attributes: NftAttribute[];
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
    name: string;
    creator: string;
    category: CategoryNFT;
    cid: string;
    supply: number;
    customFee?: CustomFee | null;
    attributes?: NFTProperties[] | null;
    customProperties?: object | null;
}
export interface NFTProperties {
    trait_type: string;
    value: string;
}
export interface Fees {
    hbar: number;
    usd: number;
}
export declare enum HederaEnviroment {
    MAINNET = "mainnet",
    TESTNET = "testnet"
}
export declare enum CategoryNFT {
    ART = "Art",
    DIGITAL_ART = "Digital art",
    MUSIC = "Music",
    COLLECTIBLE = "Collectible",
    DOCUMENT = "Document",
    OTHER = "Other"
}
export interface CustomFee {
    numerator: number;
    denominator: number;
    fallbackFee: number;
}
