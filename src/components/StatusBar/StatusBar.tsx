import { useEffect, useState } from "react"
import Web3 from "web3"
import "./StatusBar.css"


export const StatusBar = ({address, balance}: {address: string, balance:string}) => {
    
    return (
    <div className="statusBar">
        <p>UP Address: {address}</p>
        <p>Balance: {balance}</p>
    </div>
    )

}
