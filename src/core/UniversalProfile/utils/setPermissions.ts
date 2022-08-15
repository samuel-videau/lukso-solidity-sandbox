import Web3 from "web3";
import { UniversalProfile } from "../UniversalProfile.class";

export async function setPermissions(web3:Web3, to:string) {
    const universalProfile = new UniversalProfile("0x2cA2f608A79A6B2c7B62721E4Bf58D5D8d5B5da7", 'https://2eff.lukso.dev/ipfs/', web3);
    await universalProfile.initialize();

    try {
        await universalProfile.setPermissionsTo(to, "full"); 
    } catch (error:any) {
        console.error(error.message);
    }
}