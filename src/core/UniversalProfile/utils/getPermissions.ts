import Web3 from "web3";
import { UniversalProfile } from "../UniversalProfile.class";

export async function getPermissions(web3:Web3) {
    const universalProfile = new UniversalProfile("0x2cA2f608A79A6B2c7B62721E4Bf58D5D8d5B5da7", 'https://2eff.lukso.dev/ipfs/', web3);
    await universalProfile.initialize();

    // How many addresses in permissions list?
    let length = web3.utils.hexToNumber( (await universalProfile.getDataUnverified([web3.utils.keccak256("AddressPermissions[]")]))[0] );

    //The key of an Array element consists of bytes16(keccak256(KeyName)) + bytes16(uint128(ArrayElementIndex))
    
    for (let i = 0; i < length; i++) {
        let paddedIndex = web3.utils.padLeft(web3.utils.numberToHex(i), 34 - web3.utils.numberToHex(i).length + 1)
        console.log(paddedIndex);
        console.log( await universalProfile.getDataUnverified([web3.utils.keccak256("AddressPermissions[]").slice(0, 34) + paddedIndex.slice(2)]) )
    }
    
    

    /*try {
        return await universalProfile.getData("0x106A3AEEf0B19Ff321eDa4b8662bC393c270acF8", "full");
    } catch (error:any) {
        console.error(error.message);
    }*/
}