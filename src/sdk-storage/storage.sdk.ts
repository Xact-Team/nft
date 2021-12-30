import axios from 'axios';
import { NFTDto } from 'src/models/hedera.interface';
import {
  DeleteResponse,
  UploadResponse,
} from 'src/models/nft-storage.interface';

const storageBaseUrl = 'https://api.nft.storage';

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
  cid,
}: NFTDto & { token: string; cid: string }) {
  const { data } = await axios.post<UploadResponse>(
    `${storageBaseUrl}/upload`,
    {
      name,
      description: { type: 'string', description: description },
      creator,
      category,
      supply,
      properties: customProperties,
      royalties: customRoyaltyFee,
      attributes,
      image: {
        type: 'string',
        description: `https://cloudflare-ipfs.com/ipfs/${cid}`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!data.ok) {
    throw new Error(data.error.message);
  }

  return data.value.cid;
}

export async function storeNFT({
  token,
  media,
}: {
  token: string;
  media: string;
}) {
  const { data } = await axios.post<UploadResponse>(
    `${storageBaseUrl}/upload`,
    {
      photo: media,
    },
    {
      headers: {
        'Content-Type': 'image/*',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!data.ok) {
    throw new Error(data.error.message);
  }

  return data.value.cid;
}

export async function deleteNFT({
  cid,
  token,
}: {
  cid: string;
  token: string;
}) {
  return axios.delete<DeleteResponse>(`${storageBaseUrl}/${cid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
