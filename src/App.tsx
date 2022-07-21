import React from 'react';
import './App.css';
import {connectProfile, signMessage, web3} from "./core/web3";
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


function App() {

    async function testUPClass() {
      const universalProfile = new UniversalProfile("0xA5284665954a54d12737Da405824160cCE05B0B0", 'https://2eff.lukso.dev/ipfs/', web3);
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


        const LSP7Contract = new web3.eth.Contract(LSP7Mintable.abi as AbiItem[]);
        //
        // const bytecode = LSP7Contract.deploy({
        //     data: LSP7Mintable.bytecode,
        //     arguments: ['SuperContract', 'SC', universalProfile.address, true]}).encodeABI();
        //
        // const receipt = await universalProfile.execute(ERC725XOperationType.create, 0, bytecode, ADDRESS0);

        const JSONURL = ERC725.encodeData([
            {
                keyName:
                    'LSP4Metadata',
                value: {
                    json: {
                        LSP4Metadata: {
                            description: 'The first digial golden pig.',
                            links: [
                                { title: 'Twitter', url: 'https://twitter.com/goldenpig123' },
                                { title: 'goldenpig.org', url: 'https://goldenpig.org' }
                            ],
                            icon: [
                                {
                                    width: 256,
                                    height: 256,
                                    hashFunction: 'keccak256(bytes)',
                                    hash: '0x01299df007997de92a820c6c2ec1cb2d3f5aa5fc1adf294157de563eba39bb6f',
                                    url: 'ifps://QmW5cF4r9yWeY1gUCtt7c6v3ve7Fzdg8CKvTS96NU9Uiwr'
                                }
                            ],
                            images: [
                                [
                                    {
                                        width: 1024,
                                        height: 974,
                                        hashFunction: 'keccak256(bytes)',
                                        hash: '0xa9399df007997de92a820c6c2ec1cb2d3f5aa5fc1adf294157de563eba39bb6e',
                                        url: 'ifps://QmW4wM4r9yWeY1gUCtt7c6v3ve7Fzdg8CKvTS96NU9Uiwr'
                                    }
                                ]
                            ],
                            assets: [{
                                hashFunction: 'keccak256(bytes)',
                                hash: '0x98fe032f81c43426fbcfb21c780c879667a08e2a65e8ae38027d4d61cdfe6f55',
                                url: 'ifps://QmPJESHbVkPtSaHntNVY5F6JDLW8v69M2d6khXEYGUMn7N',
                                fileType: 'fbx'
                            }]
                        }
                    },
                    url: 'ipfs://bafkreibwfjd6ld3k6hcfno6gkxzco62wn6mtbjr2vehnq2plsc7mvernnu',
                },
            },
        ], Lsp4DigitalAssetSchema as ERC725JSONSchema[]);
        const key = ERC725.encodeKeyName('LSP4Metadata');
        console.log('here')
        const bytecode2 = LSP7Contract.methods.setData([key], [JSONURL]).encodeABI();
        console.log(3)
        // const receipt2 = await universalProfile.execute(ERC725XOperationType.call, 0, bytecode2, '0x8dDFDDB6B0D7e99464457c274BFDCE7Ce1ef8EA9');
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
