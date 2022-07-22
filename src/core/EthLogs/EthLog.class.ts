import {
  ContractCreatedData,
  HashToSolMethod,
  Log,
  ExtractedLogData, LSP7Data,
  SolMethod,
  SolParameterWithValue,
  UnknownSolMethod
} from "./EthLog.models";
import Web3 from "web3";
import {StandardInterface} from "../contract-identification/standard-interfaces";
import {tryIdentifyingContract} from "../contract-identification/identify-contract";
import {LSP4DigitalAsset} from "../UniversalProfile/models/lsp4-digital-asset.model";
import LSP4DigitalAssetJSON from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import ERC725, {ERC725JSONSchema} from "@erc725/erc725.js";
import LSP7DigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json";
import {AbiItem} from "web3-utils";


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
        this._extractedData.ContractCreated = await this.extractContractCreatedData();
        break;
    }
    this._extractedData.extracted = true;
    return this._extractedData;
  }

  private async extractContractCreatedData(): Promise<ContractCreatedData> {
    const contractAddress = this.parameters[1].value;
    const contractInterface: StandardInterface = await tryIdentifyingContract(contractAddress, this._web3);
    const data = {address: contractAddress, interface: contractInterface};

    switch (contractInterface.code) {
      case 'LSP8':
        return {LSP8: await this.extractLSP4Data(contractAddress), ...data};
      case 'LSP7':
        return {LSP7: await this.extractLSP7Data(contractAddress), ...data};
      default:
        return data;
    }
  }

  private async extractLSP7Data(address: string): Promise<LSP7Data> {
    const lsp4Data: LSP4DigitalAsset = await this.extractLSP4Data(address);
    const lsp7contract = new this._web3.eth.Contract(LSP7DigitalAsset.abi as AbiItem[], address);
    const isNFT: boolean = (await lsp7contract.methods.decimals().call()) === '0';
    const supply: number = await lsp7contract.methods.totalSupply().call();
    return {isNFT, supply, ...lsp4Data};
  }

  private async extractLSP4Data(address: string): Promise<LSP4DigitalAsset> {
    const erc725Y = new ERC725(LSP4DigitalAssetJSON as ERC725JSONSchema[], address, this._web3.currentProvider, {ipfsGateway: 'https://2eff.lukso.dev/ipfs/'});
    const data = await erc725Y.getData(['LSP4TokenName', 'LSP4TokenSymbol']);
    let lsp4Metadata;

    try {
      lsp4Metadata = await erc725Y.fetchData('LSP4Metadata');
    } catch (e) {
      lsp4Metadata = {value: null};
    }

    return {
      name: data[0].value as string,
      symbol: data[1].value as string,
      metadata: lsp4Metadata.value ? (lsp4Metadata.value as any).LSP4Metadata : null,
    }
  }
}


