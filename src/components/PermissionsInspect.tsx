import { useState } from "react";
import Web3 from "web3";
import { UniversalProfile } from "../core/UniversalProfile/UniversalProfile.class";
import { getPermissions } from "../core/UniversalProfile/utils/getPermissions";
import { setPermissions } from "../core/UniversalProfile/utils/setPermissions";

export default function PermissionsInspect({universalProfile, web3}: {universalProfile:UniversalProfile, web3:Web3}) {

    const [address, setAddress] = useState("");


    //<input type="submit" name="getBtn" value="Get Permissions" />

  return (
    <div>
      <label>Address:   </label>
      <input type="text" name="address" size={48} value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={async () => {await getPermissions(web3)}}>Get Permissions</button>
      <button onClick={async () => {await setPermissions(web3, address)}}>Set Permissions</button>
    </div>
    


  )

}
