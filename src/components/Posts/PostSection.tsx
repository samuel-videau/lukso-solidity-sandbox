import { useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { ArweaveClient } from "../../core/arweave/ArweaveClient.class";
import { Post } from "../../core/SocialMedia/Post.class";
import { Registry } from "../../core/SocialMedia/Registry.class";
import { RegistryType } from "../../core/SocialMedia/types/RegistryType";
import { SocialPost } from "../../core/SocialMedia/types/SocialPost";
import { UniversalProfile } from "../../core/UniversalProfile/UniversalProfile.class";
import Form from "./Form";
import PostList from "./PostList";
import TimeStamperArtifact from "../../core/SocialMedia/TimeStamperArtifact.json";


function PostSection({address, web3, arweave, universalProfile}: {address:string, web3:Web3, arweave:ArweaveClient, universalProfile:UniversalProfile}) {

    const [posts, setPosts] = useState([] as Post[]);

    useEffect(() => {
        const fetchPosts = async () => {
            //-1. Instantiate the Timestamper Contract
            let timeStamper = new web3.eth.Contract(TimeStamperArtifact.abi as AbiItem[], "0xe3c6642a58ec9E75F0AB4F3eBbbd140EecaDa177"); 
            //0. Get the URL from the UP
            console.log(universalProfile);
            let registryId = await universalProfile.getJsonUrlContent("LSPXXSocialRegistry");
            //1. Fetch Registry from Arweave
            let registryJson = await arweave.downloadJson(registryId);
            //2. Build Registry Object
            let registry = new Registry(registryJson as RegistryType);
            //3. Iterate Registry.posts[] and map it to Post[]. This implies fetching each post from Arweave
            let posts = registry.posts.map(async (post) => {
                let postJson = await arweave.downloadJson(post.url.slice(5));
                let postInstance = new Post(postJson as SocialPost);
                // try {
                    postInstance.timestamp = await timeStamper.methods.getTimestamp(post.hash).call({from: address});
                    console.log(postInstance.timestamp);
                // } catch (err:any) {
                //     console.error("Error fetching timestamp: "+err.message? err.message : "unknown reason")                    
                //     postInstance.timestamp = 0;
                // }  
                return postInstance;
            })
            return await Promise.all(posts);
        }
        // assert universalProfile has already been initialized
        if (Object.keys(universalProfile).length != 0) fetchPosts().then((posts) => {setPosts(posts)})
    }, [universalProfile])

    function addPost(post:Post){
        setPosts(posts.concat([post]));
    }

    return (
        <div className="posts">
            <h2>Write your Post and upload it to Arweave</h2>
            <Form address={address} web3={web3} arweave={arweave} universalProfile={universalProfile} addPost={addPost}/>
            <PostList posts={posts} />
        </div>
    )
}

export default PostSection;