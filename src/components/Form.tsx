import ERC725 from "@erc725/erc725.js";
import React, { useState } from "react";
import Web3 from "web3";

import { LSPXXSocialMediaSchema } from "../core/UniversalProfile/models/LSPXXSocialMedia";
import PostKeeper from "../models/PostKeeper.json"
import Simple from "../models/Simple.json"
import { AbiItem } from "web3-utils";
import { Simulate } from "react-dom/test-utils";
import { Post } from "../core/SocialMedia/Post.class";
import { ArweaveClient } from "../core/arweave/ArweaveClient.class";
import { UniversalProfile } from "../core/UniversalProfile/UniversalProfile.class";
import { URLDataWithHash } from "@erc725/erc725.js/build/main/src/types";

import { Registry } from "../core/SocialMedia/Registry.class";
import { ArweaveObject } from "../core/arweave/ArweaveObject.class";

function Form({address, web3, arweave, universalProfile}: {address:string, web3:Web3, arweave:ArweaveClient, universalProfile:UniversalProfile}) {

    const [content, setContent] = useState("");

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        // 1. Upload new post to Arweave
        let post = new Post(content, address);
        let postJson = post.toJson();
        let arweavePost = new ArweaveObject(post)
        arweavePost.txId = await arweave.upload(post.toData(), arweavePost.tags);

        //2.Fetch most recent registry from that UP and create an updated one
        let registryJsonUrl = await universalProfile.getData([web3.utils.keccak256("LSPXXSocialRegistry")]);
        // console.log("Json URL from registry: ");
        // console.log(registryUrl);
        // console.log(registryUrl[0])
        let urlObject = (registryJsonUrl[0].value as URLDataWithHash)
        let registryId = urlObject.url.slice(5);
        //console.log((urlObject.url).slice(5))
       
        // Handle situations where content might not be JSON
        // const objTags:Array<Tag> = await arweave.getTxTags((urlObject.url).slice(5));
        // console.log(objTags)
        // let contentType:Tag | undefined = objTags.find(tag => tag.name == "Content-Type");

        let registry;
        try {
          let registryJson = await arweave.downloadJson(registryId);
          console.log(registryJson)
          registry = new Registry(registryJson);
        }
        catch (error:any) {
          if (error.message) console.log("Unable to fetch Social Registry. "+error.message)
          registry = new Registry();
        }
        
        registry.addPost(arweavePost)
        //3. Upload updated registry to Arweave
        let arweaveRegistry = new ArweaveObject(registry);
        arweaveRegistry.txId = await arweave.upload(arweaveRegistry.object.toData(), arweaveRegistry.tags)

        //4. Push that registry on-chain, to the timestamper contract and the UP

        const provider = new Web3.providers.HttpProvider(
            'https://rpc.l16.lukso.network',
        );

        const erc725 = new ERC725(LSPXXSocialMediaSchema, address, provider);

        const jsonURL = erc725.encodeData([
            {
              keyName: 'LSPXXSocialRegistry',
              value: {
                json: arweaveRegistry.object.toJson(),
                url: arweaveRegistry.url,
              },
            },
          ]);

        
        /*const simpleStorage = new web3.eth.Contract(Simple.abi as AbiItem[], "0x401b2d02f0aE8EC65c30b19d55f26B89c484F2bd");
        console.log("json URL: "+jsonURL.values[0])
        simpleStorage.methods.updateJsonURL(jsonURL.values[0]).send({from: address})
        .then((receipt:any) => {
          console.log(receipt)
        });*/
 
        const postKeeper = new web3.eth.Contract(PostKeeper.abi as AbiItem[], "0xdc82BF6487b1B01FAaeBB5130EC2513630465F17"); 
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
          })
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