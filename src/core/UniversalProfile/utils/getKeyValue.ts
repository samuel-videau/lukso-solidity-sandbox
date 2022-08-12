import { URLDataWithHash } from "@erc725/erc725.js/build/main/src/types";
import Web3 from "web3";
import { UniversalProfile } from "../UniversalProfile.class";

export async function getKeyValue(web3:Web3, key:string): Promise<string> {
    const universalProfile = new UniversalProfile("0x2cA2f608A79A6B2c7B62721E4Bf58D5D8d5B5da7", 'https://2eff.lukso.dev/ipfs/', web3);
    await universalProfile.initialize();

    try {
        let result = (await universalProfile.getDataSolo(key)).value;
        if (typeof(result) === "string")  return result;
        else return (result as any).url;
    } catch (error:any) {
        console.error(error.message);
    }

    return ""
}