import { useState } from "react";
import Web3 from "web3";
import { UniversalProfile } from "../core/UniversalProfile/UniversalProfile.class";
import { getPermissions } from "../core/UniversalProfile/utils/getPermissions";

export default function PermissionsInspect({universalProfile, web3}: {universalProfile:UniversalProfile, web3:Web3}) {

    
    const [address, setAddress] = useState("");
    const [permissions, setPermissions] = useState("");

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        //setPermissions(await getPermissions(web3));
        await getPermissions(web3)

    }



  return (
    <form onSubmit={handleSubmit}>
        <label>Address:   </label>
        <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input type="submit" value="Get Permissions" />
    </form>
  )

}
