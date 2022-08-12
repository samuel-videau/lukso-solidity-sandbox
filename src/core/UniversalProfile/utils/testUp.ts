import ERC725 from "@erc725/erc725.js";
import { LSP7Mintable } from "@lukso/lsp-factory.js";
import { AbiItem } from "web3-utils";
import { tryIdentifyingContract } from "../../contract-identification/identify-contract";
import { InterfaceToSchema } from "../../contract-identification/interface-to-schema";
import { StandardInterface } from "../../contract-identification/standard-interfaces";
import { EthLog } from "../../EthLogs/EthLog.class";
import { web3 } from "../../web3";
import { UniversalProfile } from "../UniversalProfile.class";

export async function testUPClass() {
    const universalProfile = new UniversalProfile("0xca4978c873C19AaEDDa7B6917dFB2CbD92866D55", 'https://2eff.lukso.dev/ipfs/', web3);
    await universalProfile.initialize();


      await universalProfile.subscribeLogs(0);
      setTimeout( async () => {
        const logs: EthLog[] = universalProfile.getLogs();
        console.log('============LOGS============');
        console.log('Total of logs: ' + logs.length);
        console.log('\n\n\n');
        for (const log of logs){
          console.log('==============EVENT==============');
          console.log('Name: ' + log.getName());
          if (log.getName() === 'ContractCreated') {
              const contractAddress = log.getParameters()[1].value;
              const contractInterface: StandardInterface = await tryIdentifyingContract(contractAddress, web3);
              console.log('Contract type: ' + contractInterface.name);
              const contractSchema = InterfaceToSchema.get(contractInterface.code);
              if (contractSchema) {
                  try {
                      const erc725Y = new ERC725(contractSchema, contractAddress, web3.currentProvider, {ipfsGateway: 'https://2eff.lukso.dev/ipfs/'});
                      console.log(await erc725Y.getData());
                  } catch (e) {
                      console.error(e);
                  }
              }
      
          }
          console.log(log.getParameters());
          console.log(log.getLog());
        }
      }, 4000);

      const permissions = await universalProfile.fetchPermissionsOf('0xD77B3A5B984FDF508313F462210f5A0aA9De6BdB');
      console.log(permissions);
}