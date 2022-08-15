import { arweave } from "./arweave";
import { Tag } from "../Post/Tag"
import { createSignedTx, readFile } from "../../utils/helpers";

export const uploadFile = async (pathname: string, tags?: Tag[]) => {
    // Read the file into the program
    let data = await readFile(pathname);
    // Instantiate signedTx
    let tx = await createSignedTx(data, tags)
    // Submit
    const response = await arweave.transactions.post(tx);
    console.log(response);
    switch (response.status) {
        case 200:
            console.log("Transaction " + tx.id + " submitted sucessfully");
            console.log(response);
            return response.status;
        default:
            throw new Error("uploadPost: Failed to upload post data")
    }
 
}