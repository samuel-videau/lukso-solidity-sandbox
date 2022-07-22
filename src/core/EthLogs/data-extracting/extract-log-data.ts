import Web3 from "web3";

import {ContractCreatedData, ExecutedData, SolParameterWithValue} from "../EthLog.models";
import {tryIdentifyingContract} from "./utils/contract-identification/identify-contract";

import {extractLSP7Data} from "./contract-created/extract-lsp7-data";
import {extractLSP4Data} from "./contract-created/extract-lsp4-data";
import {extractLSP3Data} from "./contract-created/extract-lsp3-data";
import {UNKNOWN_CONTRACT_INTERFACE} from "./utils/contract-identification/standard-interfaces";
import {
    methodIdToInterface,
    MethodInterface,
    UNKNOWN_METHOD_INTERFACE
} from "./utils/method-identification/method-interfaces";

export async function extractContractCreatedData(parameters: SolParameterWithValue[], web3: Web3): Promise<ContractCreatedData> {
    const data: ContractCreatedData = {address: parameters[1].value, value: parseInt(parameters[2].value), interface: UNKNOWN_CONTRACT_INTERFACE};
    data.interface = await tryIdentifyingContract(data.address, web3);

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

export async function extractExecutedData(parameters: SolParameterWithValue[]): Promise<ExecutedData> {
    const data: ExecutedData = {address: parameters[1].value, value: parseInt(parameters[2].value), interface: UNKNOWN_METHOD_INTERFACE};
    if (parameters[3].name === 'selector') {
        const methodInterface: MethodInterface | undefined = methodIdToInterface.get(parameters[3].value);
        data.interface = methodInterface ? methodInterface : UNKNOWN_METHOD_INTERFACE;
    }
    return data;
}