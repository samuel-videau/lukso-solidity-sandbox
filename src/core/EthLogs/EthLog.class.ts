import Web3 from "web3";

import {
  HashToSolMethod,
  Log,
  ExtractedLogData,
  SolMethod,
  SolParameterWithValue, UnknownSolMethod,
} from "./EthLog.models";
import {extractContractCreatedData, extractExecutedData} from "./data-extracting/extract-log-data";


export class EthLog {

  private readonly _web3: Web3;
  private readonly _log: Log;
  private readonly _method: SolMethod = UnknownSolMethod;
  private readonly _decodedParameters;

  private _extractedData: ExtractedLogData = { extracted: false };

  constructor(log: Log, provider: string, method: {method?: SolMethod, hashToSolMethod?: HashToSolMethod}) {
    this._log = log;
    this._web3 = new Web3(provider);
    if (method.method) {
      this._method = method.method;
    } else if (method.hashToSolMethod) {
      this._method = method.hashToSolMethod.get(log.topics[0]) ? method.hashToSolMethod.get(log.topics[0]) as SolMethod : UnknownSolMethod;
    }
    this._decodedParameters = this._method.name === 'unknown' ? {} : this._web3.eth.abi.decodeLog(this._method.parameters, log.data, log.topics.filter((x, i) => i !== 0));
  }

  get name(): string {
    return this._method.name;
  }

  get log(): Log {
    return this._log;
  }

  get parameters(): SolParameterWithValue[] {
    return this._method.parameters.map((x) => {return {...x, value: this._decodedParameters[x.name]}});
  }

  get extractedData(): ExtractedLogData {
    return this._extractedData;
  }

  public async extractData(): Promise<ExtractedLogData> {
    if (this._extractedData.extracted) return this._extractedData;
    switch (this._method.name) {
      case 'ContractCreated':
        this._extractedData.ContractCreated = await extractContractCreatedData(this.parameters, this._web3);
        break;
      case 'Executed':
        this._extractedData.Executed = await extractExecutedData(this.parameters);
        break;
    }
    this._extractedData.extracted = true;
    return this._extractedData;
  }
}


