import Web3 from 'web3';

declare const window: any;

export let web3 = new Web3(window.ethereum);

export async function connectProfile() {
  web3 = new Web3(window.ethereum);

  const accountsRequest: string[] = await web3.eth.requestAccounts();
  //const accounts: string[] = await web3.eth.getAccounts(); //should also yield the same address

  //console.log(accountsRequest)
  //console.log(accounts)

  return web3;
}

export async function signMessage() {
  const signed = await web3.eth.sign('test', (await web3.eth.getAccounts())[0]);
  console.log(signed);
}

