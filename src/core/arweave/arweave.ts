import Arweave from "arweave";
import _arweaveAddress from "./arweaveAddress.json"

export const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});
export const arweaveAddress = _arweaveAddress;
