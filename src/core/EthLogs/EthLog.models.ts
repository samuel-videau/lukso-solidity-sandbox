import {AbiInput} from "web3-utils";

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
