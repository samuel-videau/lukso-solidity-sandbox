import { useEffect, useState } from 'react';
import Web3 from 'web3'
import { ArweaveClient } from '../core/arweave/ArweaveClient.class'
import { Post } from '../core/SocialMedia/Post.class';
import { Registry } from '../core/SocialMedia/Registry.class';
import { RegistryType } from '../core/SocialMedia/types/RegistryType';
import { SocialPost } from '../core/SocialMedia/types/SocialPost';
import { UniversalProfile } from '../core/UniversalProfile/UniversalProfile.class';

export default function PostList({address, web3, arweave, universalProfile}: {address:string, web3:Web3, arweave:ArweaveClient, universalProfile:UniversalProfile}) {


    const [posts, setPosts] = useState([] as any);

    useEffect(() => {
        const fetchPosts = async () => {
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
                return new Post(postJson as SocialPost)
            })
            return await Promise.all(posts);
        }

        if (Object.keys(universalProfile).length != 0) fetchPosts().then((posts) => {setPosts(posts)})
      
    }, [universalProfile])
    

    return (
        <div>
            <h2>The Posts made by this UP</h2>
            <ul>
                {posts.map((post:Post) => {
                    return <li key={post.hash}>{post.message} : {post.author}</li>
                })}
            </ul>
        </div>
    )
}
