import React, { useState } from "react";
import { Pinata } from "../utils/pinata/Pinata_";

function Form() {

    const [content, setContent] = useState("");

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        Pinata.pinText(content);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Content:   </label>
                <textarea name="content" value={content} cols={40} rows={5} onChange={(e) => setContent(e.target.value)}></textarea>
                <input type="submit" value="Pin to IPFS" />
            </form>
        </div>

    )
}

export default Form;