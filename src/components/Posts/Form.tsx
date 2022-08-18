import ERC725 from "@erc725/erc725.js";
import React, { useState } from "react";
import Web3 from "web3";

import { LSPXXSocialMediaSchema } from "../../core/UniversalProfile/models/LSPXXSocialMedia";
import TimeStamper from "../../core/SocialMedia/TimeStamperArtifact.json";
import { AbiItem } from "web3-utils";
import { Simulate } from "react-dom/test-utils";
import { Post } from "../../core/SocialMedia/Post.class";
import { ArweaveClient } from "../../core/arweave/ArweaveClient.class";
import { UniversalProfile } from "../../core/UniversalProfile/UniversalProfile.class";
import { URLDataWithHash } from "@erc725/erc725.js/build/main/src/types";

import { Registry } from "../../core/SocialMedia/Registry.class";
import { ArweaveObject } from "../../core/arweave/ArweaveObject.class";
import { ArweaveImage } from "../../core/arweave/ArweaveImage";
import { Image } from "../../core/SocialMedia/Image.class";

function Form({address, web3, arweave, universalProfile, addPost}: {address:string, web3:Web3, arweave:ArweaveClient, universalProfile:UniversalProfile, addPost:Function}) {

    const [content, setContent] = useState("");
    const [userFile, setUserFile] = useState<File | undefined>(undefined);

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        let post:Post;
        //0. If userFile, then upload image to Arweave
        if (userFile) {
          let image = new Image(userFile);
          let arweaveImage = new ArweaveImage(image);
          arweaveImage.txId = await arweave.upload(await image.toData(), arweaveImage.tags);
          post = new Post(content, address, {
                                              hashFunction: image.hashFunction, 
                                              hash: (await image.hash()),
                                              url: arweaveImage.url,
                                              fileType: arweaveImage.type
                                            });                                                                                                                                   
        } else {
          post = new Post(content, address);
        }
        
        // 1. Upload new post to Arweave
        let postJson = post.toJson();
        let arweavePost = new ArweaveObject(post)
        arweavePost.txId = await arweave.upload(post.toData(), arweavePost.tags);

        //2.Fetch most recent registry from that UP and create an updated one
        let registryJsonUrl = await universalProfile.getData([web3.utils.keccak256("LSPXXSocialRegistry")]);
        let urlObject = (registryJsonUrl[0].value as URLDataWithHash)
        let registryId = urlObject.url.slice(5);
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
 
        const timeStamper = new web3.eth.Contract(TimeStamper.abi as AbiItem[], "0xe3c6642a58ec9E75F0AB4F3eBbbd140EecaDa177"); 
        console.log("posthash: "+postJson.LSPXXProfilePostHash);
        console.log("jsonURL: "+jsonURL.values[0])
        let txData = timeStamper.methods.post(postJson.LSPXXProfilePostHash, jsonURL.values[0]).encodeABI(); 

        web3.eth.sendTransaction({
            from: address,
            to: timeStamper.options.address,
            value: 0,
            data: txData,
            gas:9999999,
            gasPrice: '1',
          }).then((receipt:any) => {
            console.log(receipt);
            addPost(post)
          })
    }

    const simulatePost = async () => {
      let post = new Post(content, address);
      let priceInWinston = await arweave.estimateCost(post.byteSize());
      let priceInDollar = await arweave.winstonToDollar(priceInWinston);
      console.log("Price in Dollar: $"+priceInDollar)
    }

    const fileUpload = (event:React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return
      console.log(event.target.files[0])
      setUserFile(event.target.files[0]);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Content:   </label>
                <textarea name="content" value={content} cols={40} rows={5} onChange={(e) => setContent(e.target.value)}></textarea>
                <input type="file" onChange={(e) => fileUpload(e)} />
                <input type="submit" value="Post" />
            </form>
            <button onClick={() => simulatePost()}>Simulate Post</button>
        </div>

    )
}

export default Form;