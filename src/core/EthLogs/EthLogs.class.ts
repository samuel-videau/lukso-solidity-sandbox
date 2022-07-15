import {EthLog} from "./EthLog.class";
import {HashToSolMethod, Log, SolMethod, UnknownSolMethod} from "./EthLog.models";

export class EthLogs {

  private readonly solMethodsHashesRepo: HashToSolMethod;
  private readonly ethLogs: Array<EthLog>;

  constructor(solMethodsHashesRepo: HashToSolMethod) {
    this.ethLogs = [];
    this.solMethodsHashesRepo = solMethodsHashesRepo;
  }

  public addLog(log: Log) {
    const method = this.solMethodsHashesRepo.get(log.topics[0]) ? this.solMethodsHashesRepo.get(log.topics[0]) as SolMethod : UnknownSolMethod;
    this.ethLogs.push(new EthLog(log, method));
  }

  public getLogs() {
    return this.ethLogs;
  }
}
