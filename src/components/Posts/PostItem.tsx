import { Post } from "../../core/SocialMedia/Post.class";



function PostItem({post}: {post:Post}) {

    function fetchAsset() {
        console.log("Inside fetchAsset)")
        if (!post.asset) return;
        console.log("Found a post with asset. Url: "+"https://arweave.net/"+post.asset.url.slice(5))
        switch (post.asset.fileType) {
            case "image":
                return <img src={"https://arweave.net/"+post.asset.url.slice(5)} />
            default:
                return "Unknown filetype";
        }   
    }

    return (
        <div>
            <h6>{post.author} in  {post.date?.toString()}</h6>
            <p>{post.message}</p>
            {fetchAsset()}
        </div>
    )

}

export default PostItem;