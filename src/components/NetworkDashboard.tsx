import Bundlr from "@bundlr-network/client/";
import { Arweave } from "../utils/arweave/Arweave";

declare const window: any;

function NetworkDashboard() {
    
    const connectToBundlr = async () => {
        const bundlr = new Bundlr("https://node1.bundlr.network", "Matic", window.ethereum); //TODO change this to the Arweave JSON object with the privateKey

        console.log("Bundlr loaded address: "+bundlr.address);
        console.log("Address Balance: "+await bundlr.getLoadedBalance());
        
        console.log("Current price for 256 bytes through Bundlr: "+bundlr.getPrice(256))
    }


    return (
        <button onClick={() => {connectToBundlr()}}>Connect to Bundlr</button>
    )
}

export default NetworkDashboard;