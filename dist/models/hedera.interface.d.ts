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
}
export interface NftCreated {
    url: string;
    txId: string;
    tokenId: string;
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
