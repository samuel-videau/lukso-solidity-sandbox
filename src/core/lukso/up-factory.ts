import { LSPFactory } from '@lukso/lsp-factory.js';

declare const window: any;
const provider = 'https://rpc.l16.lukso.network'; // RPC provider url


const lspFactory = new LSPFactory(window.ethereum);

const myLSP3MetaData = {
  name: 'My Universal Profile',
  description: 'My cool Universal Profile',
  profileImage: [
    {
      width: 500,
      height: 500,
      hashFunction: 'keccak256(bytes)',
      // bytes32 hex string of the image hash
      hash: '0xfdafad027ecfe57eb4ad047b938805d1dec209d6e9f960fc320d7b9b11cbed14',
      url: 'ipfs://QmPLqMFHxiUgYAom3Zg4SiwoxDaFcZpHXpCmiDzxrtjSGp',
    },
  ],
  backgroundImage: [
    {
      width: 500,
      height: 500,
      hashFunction: 'keccak256(bytes)',
      // bytes32 hex string of the image hash
      hash: '0xfdafad027ecfe57eb4ad047b938805d1dec209d6e9f960fc320d7b9b11cbed14',
      url: 'ipfs://QmPLqMFHxiUgYAom3Zg4SiwoxDaFcZpHXpCmiDzxrtjSGp',
    },
  ],
  tags: ['public profile', 'creator'],
  links: [
    {
      title: 'My Website',
      url: 'www.my-website.com',
    },
  ],
};

export async function deployUP() {
  const myContracts = await lspFactory.UniversalProfile.deploy({
    controllerAddresses: ['0xD692Ba892a902810a2EE3fA41C1D8DcD652D47Ab'],
    lsp3Profile: myLSP3MetaData
  });

  console.log(myContracts);
}

