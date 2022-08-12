import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { UniversalProfile } from '../core/UniversalProfile/UniversalProfile.class'
import { getKeyValue } from '../core/UniversalProfile/utils/getKeyValue'

export default function MyUP({web3, universalProfile}: {web3:Web3, universalProfile: UniversalProfile}) {

    const [jsonURL, setJsonURL] = useState("")


    useEffect(() => {
     const fetchKeys = async () => {
        console.log((await getKeyValue(web3, web3.utils.keccak256('LSP3Profile'))));
        return await getKeyValue(web3, web3.utils.keccak256("LSPXXSocialRegistry"))
     }


     fetchKeys().then((_jsonURL) => {
        setJsonURL(_jsonURL);
     })
    }, [])

    const updateJsonURL = () => {
        universalProfile.setData([web3.utils.keccak256("LSPXXSocialRegistry")], ["0x002"])
    }
    
  return (
    <div>
        <p>JSON URL: {jsonURL}</p>
        <button onClick={() => updateJsonURL()}>Update Key LSPXXSocialRegistry</button>

    </div>
  )
}
