import Bundlr from "@bundlr-network/client/build/common/bundlr";
import { readFile } from "../../utils/helpers";

export const bundlrEstimateCostPath = async (path:string, bundlr:Bundlr) => {
    const bytes = new TextEncoder().encode( (readFile(path)).toString() ).length
    console.log("Data size: "+bytes+" bytes")
    return await bundlr.getPrice(bytes);
}