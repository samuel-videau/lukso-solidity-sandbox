import Web3 from "web3";

export async function getActiveEOA(web3: Web3) {
  return (await web3.eth.getAccounts())[0];
}
