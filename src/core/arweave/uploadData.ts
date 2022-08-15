import { arweave } from "./arweave";
import { Tag } from "../Post/Tag"
import { createSignedTx } from "../../utils/helpers";

export const uploadData = async (data: Buffer, tags?: Tag[]): Promise<[number, string]> => {
    // Instantiate signedTx
    let tx = await createSignedTx(data, tags)
    // Submit
    const response = await arweave.transactions.post(tx);
    console.log(response);
    switch (response.status) {
        case 200:
            console.log("Transaction " + tx.id + " submitted sucessfully");
            return  [response.status, tx.id];
        default:
            return [response.status, '0']
    }
 
}