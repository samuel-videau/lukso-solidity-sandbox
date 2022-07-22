import {AbiInput} from "web3-utils";
import {StandardInterface} from "../contract-identification/standard-interfaces";
import {LSP4DigitalAsset, LSP4DigitalAssetMetadata} from "../UniversalProfile/models/lsp4-digital-asset.model";
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
  extracted: boolean,
  ContractCreated?: ContractCreatedData;
}

export interface ContractCreatedData {
  address: string,
  interface: StandardInterface,
  LSP0?: LSP3UniversalProfile,
  LSP7?: LSP7Data,
  LSP8?: LSP4DigitalAsset
}

export interface LSP7Data {
  name: string,
  symbol: string,
  supply: number,
  isNFT: boolean,
  metadata?: LSP4DigitalAssetMetadata
}