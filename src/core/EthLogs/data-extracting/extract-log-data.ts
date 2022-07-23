import Web3 from "web3";

import {ContractCreatedData, DataChangedData, ExecutedData, SolParameterWithValue} from "../EthLog.models";
import {tryIdentifyingContract} from "./utils/contract-identification/identify-contract";

import {extractLSP7Data} from "./contract-created/extract-lsp7-data";
import {extractLSP4Data} from "./contract-created/extract-lsp4-data";
import {extractLSP3Data} from "./contract-created/extract-lsp3-data";
import {
    methodIdToInterface,
    MethodInterface
} from "./utils/method-identification";
import {EthLogs} from "../EthLogs.class";
import {topicToEvent} from "./utils/event-identification";
import {keyToERC725YSchema} from "./utils/erc725YSchema-identification";
import {ERC725, ERC725JSONSchema} from "@erc725/erc725.js";

export async function extractContractCreatedData(parameters: SolParameterWithValue[], web3: Web3): Promise<ContractCreatedData> {
    const data: ContractCreatedData = {address: parameters[1].value, value: parseInt(parameters[2].value)};
    data.interface = await tryIdentifyingContract(data.address, web3);
    if (!data.interface) return data;

    switch (data.interface.code) {
        case 'LSP8':
            return {LSP8: await extractLSP4Data(data.address, web3), ...data};
        case 'LSP7':
            return {LSP7: await extractLSP7Data(data.address, web3), ...data};
        case 'LSP0':
            return {LSP0: await extractLSP3Data(data.address, web3), ...data};
        default:
            return data;
    }
}

export async function extractExecutedData(parameters: SolParameterWithValue[], transactionHash: string, web3: Web3): Promise<ExecutedData> {
    const data: ExecutedData = {address: parameters[1].value, value: parseInt(parameters[2].value), logs: new EthLogs(topicToEvent, web3.currentProvider)};
    if (parameters[3].name === 'selector') {
        const methodInterface: MethodInterface | undefined = methodIdToInterface.get(parameters[3].value);
        if (methodInterface) {
            data.interface = methodInterface;
            if (data.interface.associatedTopics && data.interface.associatedTopics.length > 0) {
                const transaction = await web3.eth.getTransactionReceipt(transactionHash);
                for (const log of transaction.logs) {
                    if (data.interface.associatedTopics.includes(log.topics[0])) await data.logs.addLog(log);
                }
            }
        }
    }
    return data;
}

export async function extractDataChangedData(address: string, parameters: SolParameterWithValue[], web3: Web3): Promise<DataChangedData> {
    const data: DataChangedData = {key: parameters[0].value};
    data.schema = keyToERC725YSchema.get(data.key);

    if (data.schema) {
        const erc725y = new ERC725([data.schema as ERC725JSONSchema], address, web3.currentProvider, {ipfsGateway: 'https://2eff.lukso.dev/ipfs/'});
        data.actualValue = (await erc725y.fetchData())[0];
    }

    return data;
}



