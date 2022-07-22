import {
  ContractCreatedData,
  HashToSolMethod,
  Log,
  LogData, LSP7Data,
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

  private readonly web3: Web3;
  private readonly log: Log;
  private readonly method: SolMethod = UnknownSolMethod;
  private readonly decodedParameters;

  private logData: LogData = { extracted: false };

  constructor(log: Log, provider: string, method: {method?: SolMethod, hashToSolMethod?: HashToSolMethod}) {
    this.log = log;
    this.web3 = new Web3(provider);
    if (method.method) {
      this.method = method.method;
    } else if (method.hashToSolMethod) {
      this.method = method.hashToSolMethod.get(log.topics[0]) ? method.hashToSolMethod.get(log.topics[0]) as SolMethod : UnknownSolMethod;
    }
    this.decodedParameters = this.method.name === 'unknown' ? {} : this.web3.eth.abi.decodeLog(this.method.parameters, log.data, log.topics.filter((x, i) => i !== 0));
  }

  public getName(): string {
    return this.method.name;
  }

  public getLog(): Log {
    return this.log;
  }

  public getParameters(): SolParameterWithValue[] {
    return this.method.parameters.map((x) => {return {...x, value: this.decodedParameters[x.name]}});
  }

  public async extractData(): Promise<LogData> {
    if (this.logData.extracted) return this.logData;
    switch (this.method.name) {
      case 'ContractCreated':
        this.logData.ContractCreated = await this.extractContractCreatedData();
        break;
    }
    this.logData.extracted = true;
    return this.logData;
  }

  private async extractContractCreatedData(): Promise<ContractCreatedData> {
    const contractAddress = this.getParameters()[1].value;
    const contractInterface: StandardInterface = await tryIdentifyingContract(contractAddress, this.web3);
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
    const lsp7contract = new this.web3.eth.Contract(LSP7DigitalAsset.abi as AbiItem[], address);
    const isNFT: boolean = (await lsp7contract.methods.decimals().call()) === '0';
    const supply: number = await lsp7contract.methods.totalSupply().call();
    return {isNFT, supply, ...lsp4Data};
  }

  private async extractLSP4Data(address: string): Promise<LSP4DigitalAsset> {
    const erc725Y = new ERC725(LSP4DigitalAssetJSON as ERC725JSONSchema[], address, this.web3.currentProvider, {ipfsGateway: 'https://2eff.lukso.dev/ipfs/'});
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


