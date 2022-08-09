import { arweave } from "./arweave";
import { readFile } from "../../utils/helpers";


export const estimateCostData = async (file:Buffer) => {
    const bytes = new TextEncoder().encode(file.toString()).length
    console.log("Data size: "+bytes+" bytes")
    const response = await arweave.api.get(`/price/${bytes}`);
    
    switch (response.status) {
        case 200:
            return response.data;
            break;
        default:
            throw new Error("Request failed: estimateCost")
    }
}

export const estimateCostPath = async (pathname:string) => {
    return await estimateCostData(readFile(pathname));
}

export const estimateCostJson = async (jsonObject:any) => {
    return await estimateCostData(Buffer.from(JSON.stringify(jsonObject)));
}
