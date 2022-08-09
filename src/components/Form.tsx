import React, { useState } from "react";
import { uploadPost } from "../core/arweave/uploadPost";
import { composePost } from "../utils/helpers";
import { Pinata } from "../utils/pinata/Pinata_";

function Form({address}: {address:string}) {

    const [content, setContent] = useState("");

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        let [txStatus, txId] = await uploadPost(composePost(address, content))
        console.log("Uploaded with txId: ", txId)
        // Pinata.pinText(content); Deprecated, we're not using IPFS anymore
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Content:   </label>
                <textarea name="content" value={content} cols={40} rows={5} onChange={(e) => setContent(e.target.value)}></textarea>
                <input type="submit" value="Upload to Arweave" />
            </form>
        </div>

    )
}

export default Form;