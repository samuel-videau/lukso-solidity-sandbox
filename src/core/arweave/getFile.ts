import { arweave } from "./arweave";

export const getFilebyTxid = async (txid: string) => {
    let response = await arweave.api.get(`/${txid}`, {timeout: 10000}).catch(() => { console.error('timeout loading data')});

    let content =  {};

    switch (response?.status) {
        case 200:
          case 202:
            content = response.data;
            break;
          case 404:
            console.error("Tx not found");
            break;
          default:
            console.error("Data not found for TX");
    }

    return content
}

// return getPostbyAuthor TODO