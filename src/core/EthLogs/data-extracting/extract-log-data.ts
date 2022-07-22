import Web3 from "web3";

import {ContractCreatedData} from "../EthLog.models";
import {StandardInterface} from "../../contract-identification/standard-interfaces";
import {tryIdentifyingContract} from "../../contract-identification/identify-contract";

import {extractLSP7Data} from "./contract-created/extract-lsp7-data";
import {extractLSP4Data} from "./contract-created/extract-lsp4-data";
import {extractLSP3Data} from "./contract-created/extract-lsp3-data";

export async function extractContractCreatedData(address: string, web3: Web3): Promise<ContractCreatedData> {
    const contractInterface: StandardInterface = await tryIdentifyingContract(address, web3);
const data = {address: address, interface: contractInterface};

switch (contractInterface.code) {
    case 'LSP8':
        return {LSP8: await extractLSP4Data(address, web3), ...data};
    case 'LSP7':
        return {LSP7: await extractLSP7Data(address, web3), ...data};
    case 'LSP0':
        return {LSP0: await extractLSP3Data(address, web3), ...data};
    default:
        return data;
}
}