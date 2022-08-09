import { readFile } from "../../utils/helpers";
import { bundlr } from "./bundlr";

export const bundlrEstimateCostPath = async (path:string) => {
    const bytes = new TextEncoder().encode( (readFile(path)).toString() ).length
    console.log("Data size: "+bytes+" bytes")
    return await bundlr.getPrice(bytes);
}