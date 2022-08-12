import Arweave from "arweave";
import _arweaveAddress from "./arweaveAddress.json";

export const arweavePrefix = "ar://"
export const arweave = Arweave.init({});
export const arweaveAddress = _arweaveAddress;
