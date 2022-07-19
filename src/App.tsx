import React from 'react';
import './App.css';
import {connectProfile, signMessage, web3} from "./core/web3";
import {deployUP} from "./core/lukso/up-factory";
import {ERC725XOperationType, UniversalProfile} from "./core/UniversalProfile/UniversalProfile.class";
import LSP7DigitalAssetInit from "./assets/artifacts/LSP7DigitalAssetInit.json";
import {AbiItem} from "web3-utils";
import {EthLog} from "./core/EthLogs/EthLog.class";
import {tryIdentifyingContract} from "./core/contract-identification/identify-contract";
import {StandardInterface} from "./core/contract-identification/standard-interfaces";
import {ERC725} from "@erc725/erc725.js";
import {InterfaceToSchema} from "./core/contract-identification/interface-to-schema";
import {ADDRESS0} from "./utils/address0";

function App() {

    async function testUPClass() {
      const universalProfile = new UniversalProfile("0x65068D4024B0D8dD98a95B560D290BdDB765a03b", 'https://2eff.lukso.dev/ipfs/', web3);
      await universalProfile.initialize();


        // await universalProfile.subscribeLogs(0);
        // setTimeout( async () => {
        //   const logs: EthLog[] = universalProfile.getLogs();
        //   console.log('============LOGS============');
        //   console.log('Total of logs: ' + logs.length);
        //   console.log('\n\n\n');
        //   for (const log of logs){
        //     console.log('==============EVENT==============');
        //     console.log('Name: ' + log.getName());
        //     if (log.getName() === 'ContractCreated') {
        //         const contractAddress = log.getParameters()[1].value;
        //         const contractInterface: StandardInterface = await tryIdentifyingContract(contractAddress, web3);
        //         console.log('Contract type: ' + contractInterface.name);
        //         const contractSchema = InterfaceToSchema.get(contractInterface.code);
        //         if (contractSchema) {
        //             try {
        //                 const erc725Y = new ERC725(contractSchema, contractAddress, web3.currentProvider, {ipfsGateway: 'https://2eff.lukso.dev/ipfs/'});
        //                 console.log(await erc725Y.fetchData());
        //             } catch (e) {
        //                 // console.error(e);
        //             }
        //         }
        //
        //     }
        //     console.log(log.getParameters());
        //     console.log(log.getLog());
        //   }
        // }, 4000);


    // const receipt = await universalProfile.execute(ERC725XOperationType.create, 0, LSP7DigitalAssetInit.bytecode);
    // console.log(receipt);

        await universalProfile.execute(ERC725XOperationType.create, 0, LSP7DigitalAssetInit.bytecode, ADDRESS0);
        const bytecode = (new web3.eth.Contract(LSP7DigitalAssetInit.abi as AbiItem[])).methods.initialize('Test', 'TST', '0x65068D4024B0D8dD98a95B560D290BdDB765a03b', true).encodeABI();
        const receipt = await universalProfile.execute(ERC725XOperationType.call, 0, bytecode, "0xAba58f6fCBf941AAc45688d97364C10B9FB0f5FA");

    }



    return (
        <div>
            <button onClick={() => {connectProfile()}}>Connect</button>
            <button onClick={() => {signMessage()}}>Sign</button>
            <button onClick={() => {deployUP()}}>Deploy UP</button>
            <button onClick={() => {testUPClass()}}>Test UP</button>
            <button onClick={async() => {
                console.log(await tryIdentifyingContract('0xb9379550535F90966d6252414077D95Fc761499A', web3)) }}>Identify Contract</button>
        </div>
    );
}

export default App;
