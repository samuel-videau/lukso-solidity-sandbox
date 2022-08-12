import ERC725 from "@erc725/erc725.js";
import React, { useState } from "react";
import Web3 from "web3";

import { composePost } from "../utils/helpers";

import { LSPXXSocialMediaSchema } from "../core/UniversalProfile/models/LSPXXSocialMedia";
import { arweavePrefix } from "../core/arweave/arweave";
import PostKeeper from "../models/PostKeeper.json"
import Simple from "../models/Simple.json"
import { AbiItem } from "web3-utils";

function Form({address, web3}: {address:string, web3:Web3}) {

    const [content, setContent] = useState("");

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        let postJson = composePost(address, content)

        //let [txStatus, txId] = await uploadPost(postJson)
        let txId = "Kca8Ezc_tgaXEd2o2KgTrL15vqiztf_61b287lmEK7g"
        console.log("Uploaded with txId: ", txId)

        // Pinata.pinText(content); Deprecated, we're not using IPFS anymore
        const provider = new Web3.providers.HttpProvider(
            'https://rpc.l16.lukso.network',
        );

        const erc725 = new ERC725(LSPXXSocialMediaSchema, address, provider);

        const jsonURL = erc725.encodeData([
            {
              keyName: 'LSPXXSocialRegistry',
              value: {
                json: postJson,
                url: arweavePrefix+txId,
              },
            },
          ]);

        
        /*const simpleStorage = new web3.eth.Contract(Simple.abi as AbiItem[], "0x401b2d02f0aE8EC65c30b19d55f26B89c484F2bd");
        console.log("json URL: "+jsonURL.values[0])
        simpleStorage.methods.updateJsonURL(jsonURL.values[0]).send({from: address})
        .then((receipt:any) => {
          console.log(receipt)
        });*/

        const postKeeper = new web3.eth.Contract(PostKeeper.abi as AbiItem[], "0x106A3AEEf0B19Ff321eDa4b8662bC393c270acF8");
        console.log("posthash: "+postJson.LSPXXProfilePostHash);
        console.log("jsonURL: "+jsonURL.values[0])
        let txData = postKeeper.methods.post(postJson.LSPXXProfilePostHash, jsonURL.values[0]).encodeABI(); 

        await web3.eth.sendTransaction({
            from: address,
            to: postKeeper.options.address,
            value: 0,
            data: txData,
            gas: 5000000,
            gasPrice: '1',
          }).then((receipt:any) => {
            console.log(receipt);
          })

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