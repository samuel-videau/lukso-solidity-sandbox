import React, { useState } from 'react';
import './App.css';

import {deployUP} from "./core/lukso/up-factory";
import {ERC725XOperationType, UniversalProfile} from "./core/UniversalProfile/UniversalProfile.class";
import LSP7Mintable from "@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json";
import {AbiItem} from "web3-utils";
import {tryIdentifyingContract} from "./core/contract-identification/identify-contract";
import {ADDRESS0} from "./utils/address0";
import Lsp4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import {ERC725, ERC725JSONSchema} from "@erc725/erc725.js";
import {EncodeDataInput} from "@erc725/erc725.js/build/main/src/types/decodeData";
import {StandardInterface} from "./core/contract-identification/standard-interfaces";
import {InterfaceToSchema} from "./core/contract-identification/interface-to-schema";
import {EthLog} from "./core/EthLogs/EthLog.class";
import {testPinata, pinFile} from "./utils/pinata/pinata";
// Components
import PostCanvas from './components/PostCanvas';
import NetworkDashboard from './components/NetworkDashboard';
// Libraries
import {connectProfile, signMessage, web3} from "./core/web3";
import { bundlr } from './core/bundlr/bundlr';



function App() {


    async function testUPClass() {
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
        const LSP7Contract = new web3.eth.Contract(LSP7Mintable.abi as AbiItem[]);
    }



    return (
        <div>
            <button onClick={() => {connectProfile()}}>Connect</button>
            <button onClick={() => {signMessage()}}>Sign</button>
            <button onClick={() => {deployUP()}}>Deploy UP</button>
            <button onClick={() => {testUPClass()}}>Test UP</button>
            <button onClick={() => {testPinata()}}>Test Pinata</button>
            <button onClick={() => {pinFile()}}>Pin File</button>
            <button onClick={async() => {
                console.log(await tryIdentifyingContract('0xb9379550535F90966d6252414077D95Fc761499A', web3)) }}>Identify Contract</button>
            <PostCanvas />
            <NetworkDashboard web3={web3} bundlr={bundlr}/>
        </div>
    );
}

export default App;
