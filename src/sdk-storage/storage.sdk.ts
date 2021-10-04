import axios from 'axios';
import {NFTDto} from '../models/hedera.interface';

export async function storeMetadata({
                                        token,
                                        name,
                                        description,
                                        supply,
                                        creator,
                                        category,
                                        customProperties,
                                        customRoyaltyFee,
                                        attributes,
                                        cid
                                    }: NFTDto & { token: string, cid: string }) {
    return axios.post('https://nft.storage/api/upload', {
        name,
        description: {"type": "string", "description": description},
        creator,
        category,
        supply,
        properties: customProperties,
        royalties: customRoyaltyFee,
        attributes,
        image: {"type": "string", "description": `https://cloudflare-ipfs.com/ipfs/${cid}`}
    }, {
        headers: {
            common: {
                Authorization: `Bearer ${token}`,
            },
        },
    }).then((res) => {
        return res.data.value.cid;
    });
}

export async function storeNFT({
                                   token,
                                   media
                               }: NFTDto & { token: string }) {
    return axios.post('https://api.nft.storage/upload', media,
        {
            headers: {
                "Content-Type": "image/*",
                common: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }).then((res) => {
        return res.data.value.cid;
    });
}

export async function deleteNFT({cid, token}: { cid: string, token: string }) {
    return axios.delete(`https://nft.storage/api/${cid}`, {
        headers: {
            common: {
                Authorization: `Bearer ${token}`,
            },
        },
    })
}
