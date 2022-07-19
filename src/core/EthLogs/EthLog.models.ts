import {AbiInput} from "web3-utils";
import {StandardInterface} from "../contract-identification/standard-interfaces";
import {Lsp4DigitalAsset} from "../UniversalProfile/models/lsp4-digital-asset.model";
import {LSP3UniversalProfile} from "../UniversalProfile/models/lsp3-universal-profile.model";

export type HashToSolMethod = Map<string, SolMethod>;

export interface Log {
  address: string;
  data: string;
  topics: string[];
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
}

export interface SolParameterWithValue extends AbiInput{
  value: string;
}

export interface SolMethod{
  name: string;
  parameters: AbiInput[];
}

export const UnknownSolMethod: SolMethod = {name: 'Unknown', parameters: []};

export interface LogData {
  ContractCreated?: ContractCreatedData;
}

interface ContractCreatedData {
  address: string,
  interface: StandardInterface,
  LSP0?: LSP3UniversalProfile,
  LSP7?: {
    name: string,
    symbol: string,
    supply: number,
    isNFT: boolean,
    lsp4DigitalAsset: Lsp4DigitalAsset
  },
  LSP8?: {
    name: string,
    symbol: string,
    lsp4DigitalAsset: Lsp4DigitalAsset
  }
}