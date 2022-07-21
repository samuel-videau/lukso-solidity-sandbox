import {
  ContractCreatedData,
  HashToSolMethod,
  Log,
  LogData,
  SolMethod,
  SolParameterWithValue,
  UnknownSolMethod
} from "./EthLog.models";
import Web3 from "web3";
import {StandardInterface} from "../contract-identification/standard-interfaces";
import {tryIdentifyingContract} from "../contract-identification/identify-contract";
import {web3} from "../web3";
import {InterfaceToSchema} from "../contract-identification/interface-to-schema";
import {ERC725} from "@erc725/erc725.js";
import {Lsp4DigitalAsset} from "../UniversalProfile/models/lsp4-digital-asset.model";

export class EthLog {

  private readonly web3 = new Web3();
  private readonly log: Log;
  private readonly method: SolMethod = UnknownSolMethod;
  private readonly decodedParameters;

  private logData: LogData = {};

  constructor(log: Log, method: {method?: SolMethod, hashToSolMethod?: HashToSolMethod}) {
    this.log = log;
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

  // public async extractData(): Promise<LogData> {
  //   switch (this.method.name) {
  //     case 'ContractCreated':
  //       this.logData.ContractCreated = await this.extractContractCreatedData();
  //       break;
  //   }
  //   return this.logData;
  // }
  //
  // public async extractContractCreatedData(): Promise<ContractCreatedData> {
  //   const contractAddress = this.getParameters()[1].value;
  //   const contractInterface: StandardInterface = await tryIdentifyingContract(contractAddress, web3);
  //
  //   const contractSchema = InterfaceToSchema.get(contractInterface.code);
  //   let data;
  //   if (contractSchema) {
  //     try {
  //       const erc725Y = new ERC725(contractSchema, contractAddress, web3.currentProvider, {ipfsGateway: 'https://2eff.lukso.dev/ipfs/'});
  //       data = await erc725Y.fetchData();
  //     } catch (e) {}
  //   }
  //
  //   const
  // }
}
