import { useEffect, useState } from 'react';
import Web3 from 'web3'
import { ArweaveClient } from '../../core/arweave/ArweaveClient.class'
import { Post } from '../../core/SocialMedia/Post.class';
import { Registry } from '../../core/SocialMedia/Registry.class';
import { RegistryType } from '../../core/SocialMedia/types/RegistryType';
import { SocialPost } from '../../core/SocialMedia/types/SocialPost';
import { UniversalProfile } from '../../core/UniversalProfile/UniversalProfile.class';
import TimeStamperArtifact from "../../core/SocialMedia/TimeStamperArtifact.json";
import { AbiItem } from 'web3-utils';
import PostItem from './PostItem';

export default function PostList({posts}: {posts:Post[]}) {




    return (
        <div>
            <h2>The Posts made by this UP</h2>
            <ul>
                {posts.map((post:Post) => {
                    return <li key={post.hash}><PostItem post={post} /></li>
                })}
            </ul>
        </div>
    )
}
