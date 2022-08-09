import Bundlr from '@bundlr-network/client';
import fs from "fs";
import { arweaveAddress } from '../arweave/arweave';

export const bundlr = new Bundlr("http://node1.bundlr.network", "ethereum", arweaveAddress);