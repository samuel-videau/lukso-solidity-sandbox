import {AbiInput} from "web3-utils";
import {StandardInterface} from "./data-extracting/utils/contract-identification/standard-interfaces";
import {LSP4DigitalAsset, LSP4DigitalAssetMetadata} from "../UniversalProfile/models/lsp4-digital-asset.model";
import {LSP3UniversalProfile} from "../UniversalProfile/models/lsp3-universal-profile.model";
import {MethodInterface} from "./data-extracting/utils/method-identification";
import {ERC725JSONSchema} from "@erc725/erc725.js";
import {EthLogs} from "./EthLogs.class";
import {DecodeDataOutput} from "@erc725/erc725.js/build/main/src/types/decodeData";

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

export interface SolEvent{
  name: string;
  topic: string
  parameters: AbiInput[];
}

export const UNKNOWN_SOL_EVENT: SolEvent = {name: 'Unknown', topic: '0x', parameters: []};

export interface ExtractedLogData {
  extracted: boolean,
  ContractCreated?: ContractCreatedData;
  Executed?: ExecutedData;
  DataChanged?: DataChangedData;

}

export interface DataChangedData {
  key: string;
  schema?: ERC725JSONSchema;
  value?: DecodeDataOutput | string;
  actualValue?: DecodeDataOutput | string;
}

export interface ExecutedData {
  address: string;
  interface?: MethodInterface;
  contract: StandardsData & {
    interface?: StandardInterface,
  };
  value: number;
  logs: EthLogs;
}

export interface ContractCreatedData extends ContractData {
  value: number,
}

export interface ContractData extends StandardsData{
  address: string,
  interface?: StandardInterface,
}

export interface StandardsData {
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