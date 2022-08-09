import axios from "axios";
import { arweave, arweaveAddress } from "../core/arweave/arweave";
import fs from "fs";
import { Tag } from "../models/Tag";
import { web3 } from "../core/web3";
import { SocialPost } from "../models/SocialPost";

const APPNAME = "Lookso";
const ARID = 5632;

export const getSizeInBytes = (obj:any) => {
    let str = null;
    if (typeof obj === 'string') {
      // If obj is a string, then use it
      str = obj;
    } else {
      // Else, make obj into a string
      str = JSON.stringify(obj);
    }
    // Get the length of the Uint8Array
    const bytes = new TextEncoder().encode(str).length;
    return bytes;
};


export const winstonToDollar = async (valueInWinston: string) => {
    return arToDollar(arweave.ar.winstonToAr(valueInWinston));
}

export const arToDollar = async (valueInAR: string) => {
    let request = axios.create({
        headers:{'X-CMC_PRO_API_KEY': 'b3042fe3-7f38-4787-847e-b72fa17657b0'}
    })

    let response:any = {}
    try {
      response = await request.get(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${valueInAR}&id=${ARID}`)
    } catch (error) {
      return "error";
    }
    return response.data.data.quote.USD.price;
}


export const readFile =  (pathname: string) => {
  return fs.readFileSync(pathname, null );
}




export const createSignedTx = async (txData:Buffer, tags?:Tag[]) => {
  // Instantiate new Tx
  let tx = await arweave.createTransaction({
    data: txData
  }, (await arweaveAddress));

  // Add Tags if there are any
  if (tags) {
    tags.forEach((tag) => {
      tx.addTag(tag.key, tag.value)
    }) 
  }
    
  // Sign
  await arweave.transactions.sign(tx, arweaveAddress);
  return tx;

}

export const getAddress = async () => {
  return await arweave.wallets.getAddress(arweaveAddress);
}


export const composePost = (upAddress:string, message:string) => {
  let postObject:SocialPost;
  let LSPXXProfilePost = {
    version: "0.0.1",
    author: upAddress,
    controller: "controllerAddress",
    message: message,
    links: [
      {
        title: "string", 
        url: "string"
      }
    ],
    asset: {
      hashFunction: 'keccak256(bytes)',
      hash: "string",
      url: "string",
      fileType: "string"
    }
  }

  let LSPXXProfilePostHash = web3.utils.keccak256(JSON.stringify(LSPXXProfilePost))
  //let LSPXXProfilePostSignature = web3.eth.sign(LSPXXProfilePostHash, upAddress);

  postObject = {
    LSPXXProfilePost,
    LSPXXProfilePostHash
  }

  return postObject;
}
