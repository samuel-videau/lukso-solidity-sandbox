import ERC725 from "@erc725/erc725.js";
import React, { useState } from "react";
import Web3 from "web3";

import { LSPXXSocialMediaSchema } from "../core/UniversalProfile/models/LSPXXSocialMedia";
import PostKeeper from "../models/PostKeeper.json"
import Simple from "../models/Simple.json"
import { AbiItem } from "web3-utils";
import { Simulate } from "react-dom/test-utils";
import { Post } from "../core/Post/Post.class";
import { ArweaveClient } from "../core/arweave/ArweaveClient.class";
import { UniversalProfile } from "../core/UniversalProfile/UniversalProfile.class";
import { URLDataWithHash } from "@erc725/erc725.js/build/main/src/types";

function Form({address, web3, arweave, universalProfile}: {address:string, web3:Web3, arweave:ArweaveClient, universalProfile:UniversalProfile}) {

    const [content, setContent] = useState("");

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        // 1. Upload new post to Arweave
        let postJson = new Post(content, address).toJson();

        //2.Fetch most recent registry from that UP and create an updated one
        let registry = await universalProfile.getData([web3.utils.keccak256("LSPXXSocialRegistry")]);
        console.log("Json URL from registry: ");
        console.log(registry);
        console.log(registry[0])
        let urlObject = (registry[0].value as URLDataWithHash)
        console.log((urlObject.url).slice(5))
       
        console.log(await arweave.getTxTags((urlObject.url).slice(5)))

        


        //3. Upload updated registry to Arweave

        //4. Push that registry on-chain, to the timestamper contract and the UP

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
                url: arweave.urlPrefix+txId,
              },
            },
          ]);

        
        /*const simpleStorage = new web3.eth.Contract(Simple.abi as AbiItem[], "0x401b2d02f0aE8EC65c30b19d55f26B89c484F2bd");
        console.log("json URL: "+jsonURL.values[0])
        simpleStorage.methods.updateJsonURL(jsonURL.values[0]).send({from: address})
        .then((receipt:any) => {
          console.log(receipt)
        });*/
 
        /*const postKeeper = new web3.eth.Contract(PostKeeper.abi as AbiItem[], "0xdc82BF6487b1B01FAaeBB5130EC2513630465F17"); 
        console.log("posthash: "+postJson.LSPXXProfilePostHash);
        console.log("jsonURL: "+jsonURL.values[0])
        let txData = postKeeper.methods.post(postJson.LSPXXProfilePostHash, jsonURL.values[0]).encodeABI(); 

        await web3.eth.sendTransaction({
            from: address,
            to: postKeeper.options.address,
            value: 0,
            data: txData,
            gas:9999999,
            gasPrice: '1',
          }).then((receipt:any) => {
            console.log(receipt);
          })*/
    }

    const simulatePost = async () => {
      let post = new Post(content, address);
      let priceInWinston = await arweave.estimateCost(post.byteSize());
      let priceInDollar = await arweave.winstonToDollar(priceInWinston);
      console.log("Price in Dollar: $"+priceInDollar)
      //let [txStatus, txId] = await uploadPost(postJson)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Content:   </label>
                <textarea name="content" value={content} cols={40} rows={5} onChange={(e) => setContent(e.target.value)}></textarea>
                <input type="submit" value="Post" />
            </form>
            <button onClick={() => simulatePost()}>Simulate Post</button>
        </div>

    )
}

export default Form;