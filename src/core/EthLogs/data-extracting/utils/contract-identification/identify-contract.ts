import Web3 from "web3";
import {StandardInterface, standardInterfaces, UNKNOWN_INTERFACE} from "./standard-interfaces";

export async function tryIdentifyingContract(address: string, web3: Web3): Promise<StandardInterface> {
    const contractCode = await web3.eth.getCode(address);

    for (let i = 0 ; i < standardInterfaces.length ; i++) {
        if (contractCode.includes(standardInterfaces[i].id.slice(2, 10))) return standardInterfaces[i];
    }

    return UNKNOWN_INTERFACE;
}