import React, { useEffect, useState } from 'react';
import './App.css';

import {deployUP} from "./core/lukso/up-factory";
import {tryIdentifyingContract} from "./core/contract-identification/identify-contract";

import {testPinata, pinFile} from "./utils/pinata/pinata";
// Components
import PostSection from './components/Posts/PostSection';
// Libraries
import {connectProfile, signMessage} from "./core/web3";
import { WebBundlr } from '@bundlr-network/client';
import { providers } from 'ethers';
import Web3 from 'web3';
import { StatusBar } from './components/StatusBar/StatusBar';
import { testUPClass } from './core/UniversalProfile/utils/testUp';
import { getKeyValue } from './core/UniversalProfile/utils/getKeyValue';
import PermissionsInspect from './components/PermissionsInspect';
import MyUP from './components/MyUP';
import { UniversalProfile } from './core/UniversalProfile/UniversalProfile.class';
import { ArweaveClient } from './core/arweave/ArweaveClient.class';
import PostList from './components/Posts/PostList';



function App() {


    const [web3, setWeb3] = useState({} as Web3)
    const [bundlr, setBundlr] = useState({} as WebBundlr)
    const [displayStatus, setDisplayStatus] = useState(false)

    const [address, setAddress] = useState("")
    const [balance, setBalance] = useState("0.00")
    const [universalProfile, setUniversalProfile] = useState({} as UniversalProfile)
    const [arweave, setArweave] = useState({} as ArweaveClient)

    useEffect(() => {

        console.log("running useEffect to update address and balance")
        const fetchAddress = async () => {
            let accounts:string[];
            if (web3.eth) {
                console.log("web3.eth exists");
                accounts = await web3.eth.getAccounts();
                console.log("Address is: "+accounts[0]) 
                setAddress(accounts[0]);
                return accounts[0]
            } else return ""
        }
        const fetchBalance = async (address:string) => {
            if (address) {
                setBalance(await web3.eth.getBalance(address));
            }
        }

        const loadUP = async () => {
            if (web3.eth) {
                const universalProfile = new UniversalProfile("0x2cA2f608A79A6B2c7B62721E4Bf58D5D8d5B5da7", 'https://2eff.lukso.dev/ipfs/', web3);
                await universalProfile.initialize();
                setUniversalProfile(universalProfile);
            }
        }

        const loadArweave = async() => {
            const arweave = new ArweaveClient();
            setArweave(arweave);
        }

        fetchAddress().then((address) => fetchBalance(address))
        loadUP();
        loadArweave();

     
    }, [web3])
    


    async function connectBundlr() {
 
        const provider = new providers.Web3Provider((window as any).ethereum);
        await provider._ready()

        const bundlr = new WebBundlr("https://node1.bundlr.network", "ethereum", provider);
        console.log(bundlr)

        setBundlr(bundlr);
    }



    return (
        <div>
            <button onClick={() => {(connectProfile().then((web3) => {setWeb3(web3); setDisplayStatus(true)}))}}>Connect</button>
            <button onClick={() => {signMessage()}}>Sign</button>
            <button onClick={() => {deployUP()}}>Deploy UP</button>
            <button onClick={() => {testUPClass()}}>Test UP</button>
            <button onClick={async() => {
                console.log(await tryIdentifyingContract('0xb9379550535F90966d6252414077D95Fc761499A', web3)) }}>Identify Contract</button>

            <div className='secondMenuBar'>
                <button onClick={() => {connectBundlr()}}>Connect Bundlr</button>
                <button onClick={() => {testPinata()}}>Test Pinata</button>
                <button onClick={() => {pinFile()}}>Pin File</button>
                <button onClick={() => {getKeyValue(web3, web3.utils.keccak256("LSPXXSocialRegistry"))}}>Log current jsonURL Value</button>
            </div>
            {displayStatus &&
                <>
                    <StatusBar address={address} balance={balance}/>
                    <PermissionsInspect universalProfile={universalProfile} web3={web3} />
                    <PostSection address={address} web3={web3} arweave={arweave} universalProfile={universalProfile}/>
                </>
            } 
        </div>
    );
}

export default App;
