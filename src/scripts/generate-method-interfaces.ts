import {AbiItem} from "web3-utils";
import {SolMethodInterface} from "../core/EthLogs/data-extracting/utils/method-identification";
import keccak256 from "keccak256";

export function generateMethodInterfaces(contractAbis: AbiItem[][]) {
    const interfaces: SolMethodInterface[] = [];

    contractAbis.forEach(abis => {
       abis.forEach(abi => {
           if (abi.name && abi.type === 'function') {
               const skeleton = generateMethodSkeleton(abi);
               const methodHash = keccak256(skeleton).toString('hex');
               const methodId = '0x' + methodHash.substring(0, 8);
               interfaces.push({name: abi.name, id: methodId});
           }
        });
    });

    return interfaces;
}

function generateMethodSkeleton(abi: AbiItem): string {
    let skeleton = abi.name + '(';

    if (abi.inputs && abi.inputs.length > 0) {
        for (let i = 0; i < abi.inputs?.length; i++) {
            skeleton += abi.inputs[i].type;
            if (i === abi.inputs.length - 1) skeleton += ')';
            else skeleton += ',';
        }
    } else skeleton += ')';

    return skeleton;
}