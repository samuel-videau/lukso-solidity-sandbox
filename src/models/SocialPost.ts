export type SocialPost = {
  LSPXXProfilePost: {
    version: string;
    author: string, // Address (UP)
    controller:string,
    message: string,
    links: Array<
      {
        title: string, 
        url: string
      }
    >,
    asset: {
      hashFunction: string,
      hash: string,
      url: string,
      fileType: string
    }
  }
  LSPXXProfilePostHash: string,
  //LSPXXProfilePostSignature: string
}