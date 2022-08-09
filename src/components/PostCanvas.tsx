import Form from "./Form";

function PostCanvas({address}: {address:string}) {


    return (
        <div className="posts">
            <h2>Write your Post and upload it to IPFS</h2>
            <Form address={address}/>
        </div>
    )
}

export default PostCanvas;