import Bundlr from "@bundlr-network/client/";
import Web3 from "web3";
import { arweave } from "../core/arweave/arweave";
import { Arweave } from "../utils/arweave/Arweave";

declare const window: any;

function NetworkDashboard({web3, bundlr}: {web3:Web3; bundlr:Bundlr}) {
    
    const connectToBundlr = async () => {
        
        console.log("Bundlr loaded address: "+bundlr.address);
        console.log("Address Balance: "+await bundlr.getLoadedBalance());

        let price = await bundlr.getPrice(256);
        
        console.log(`Current price for 256 bytes through Bundlr:  ${web3.utils.fromWei(price.toString())} ether`)  
    }

    return (
        <button onClick={() => {connectToBundlr()}}>Connect to Bundlr</button>
    )
}

export default NetworkDashboard;