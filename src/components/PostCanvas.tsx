import Web3 from "web3";
import Form from "./Form";

function PostCanvas({address, web3}: {address:string, web3:Web3}) {


    return (
        <div className="posts">
            <h2>Write your Post and upload it to IPFS</h2>
            <Form address={address} web3={web3}/>
        </div>
    )
}

export default PostCanvas;