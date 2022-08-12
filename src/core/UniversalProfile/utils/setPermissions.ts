import Web3 from "web3";
import { UniversalProfile } from "../UniversalProfile.class";

export async function setPermissions(web3:Web3) {
    const universalProfile = new UniversalProfile("0x2cA2f608A79A6B2c7B62721E4Bf58D5D8d5B5da7", 'https://2eff.lukso.dev/ipfs/', web3);
    await universalProfile.initialize();

    try {
        await universalProfile.setPermissionsTo("0x106A3AEEf0B19Ff321eDa4b8662bC393c270acF8", "full");
    } catch (error:any) {
        console.error(error.message);
    }
}