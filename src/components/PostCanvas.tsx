import Web3 from "web3";
import { ArweaveClient } from "../core/arweave/ArweaveClient.class";
import { UniversalProfile } from "../core/UniversalProfile/UniversalProfile.class";
import Form from "./Form";

function PostCanvas({address, web3, arweave, universalProfile}: {address:string, web3:Web3, arweave:ArweaveClient, universalProfile:UniversalProfile}) {


    return (
        <div className="posts">
            <h2>Write your Post and upload it to Arweave</h2>
            <Form address={address} web3={web3} arweave={arweave} universalProfile={universalProfile}/>
        </div>
    )
}

export default PostCanvas;