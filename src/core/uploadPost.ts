import { arweave, arweaveAddress } from "./arweave/arweave";
import { SocialPost } from "./SocialMedia/types/SocialPost";
import { createSignedTx, readFile, winstonToDollar } from "../utils/helpers";
import { estimateCostData } from "./arweave/estimateCosts";
import { uploadFile } from "./arweave/uploadFile";
import { uploadData } from "./arweave/uploadData";

const APPNAME = "Lookso"

export const uploadPost = async (postObject: SocialPost, attachment?: string): Promise<[number, string]> => {

    if (attachment) {
        let attachmentData = readFile(attachment);
        // Estimate Cost
        if (await winstonToDollar(await estimateCostData(attachmentData)) > 0.01) {
            throw (new Error("UploadPost: Attachment too big."))
        }

        let tags = [
            {name: "Content-Type", value: "image/jpeg"},
            {name: "App-Name", value: APPNAME},
            {name: "Parent-Hash", value: postObject.LSPXXProfilePostHash}
        ]

        await uploadFile(attachment, tags);
        //postObject.LSPXXProfilePost.asset.url = ""

    }

    // Estimate Transaction Cost
    console.log("Estimated Transaction cost: "+await estimateCostData(Buffer.from(JSON.stringify(postObject))))

    let tags = [
        {name: "Type", value: postObject.LSPXXProfilePostHash ? "comment" : "post"},
        {name: "App-name", value: APPNAME},
        {name: "Parent-Hash", value: postObject.LSPXXProfilePostHash},
        {name: "Author", value: postObject.LSPXXProfilePost.author}
    ]

    return await uploadData(Buffer.from(JSON.stringify(JSON.stringify(postObject))), tags);
 
}