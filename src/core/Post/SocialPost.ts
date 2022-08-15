import { PostAsset } from "./PostAsset";
import { Link } from "./Link";


export type SocialPost = {
  LSPXXProfilePost: {
    version: string;
    author: string, // Address (UP)
    controller:string,
    message: string,
    links: Array<Link>,
    asset: PostAsset | null,
  }
  LSPXXProfilePostHash: string,
  //LSPXXProfilePostSignature: string
}