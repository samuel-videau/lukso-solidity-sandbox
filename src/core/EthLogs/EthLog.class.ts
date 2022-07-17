import {HashToSolMethod, Log, SolMethod, SolParameterWithValue, UnknownSolMethod} from "./EthLog.models";
import Web3 from "web3";

export class EthLog {

  private readonly web3 = new Web3();
  private readonly log: Log;
  private readonly method: SolMethod = UnknownSolMethod;
  private readonly decodedParameters;

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

}
