export type SocialPost = {
  LSPXXProfilePost: {
    version: string;
    author: string, // Address (UP)
    message: string,
    links: [
      {
        title: string, 
        url: string
      }
    ],
    asset: {
      hashFunction: 'keccak256(bytes)',
      hash: string,
      url: string,
      fileType: string
    }
  }
  LSPXXProfilePostHash: string,
  LSPXXProfilePostSignature: string
}