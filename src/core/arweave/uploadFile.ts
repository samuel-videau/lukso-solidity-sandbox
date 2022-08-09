import { arweave } from "./arweave";
import { Tag } from "../../models/Tag"
import { createSignedTx, readFile } from "../../utils/helpers";
import fs from "fs";

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
            return response.status;
        default:
            throw new Error("uploadPost: Failed to upload post data")
    }
 
}