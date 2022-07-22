import {EthLog} from "./EthLog.class";
import {HashToSolMethod, Log, SolMethod, UnknownSolMethod} from "./EthLog.models";

export class EthLogs {

  private readonly solMethodsHashesRepo: HashToSolMethod;
  private readonly provider: string;
  private readonly ethLogs: Array<EthLog>;

  constructor(solMethodsHashesRepo: HashToSolMethod, provider: string) {
    this.provider = provider;
    this.ethLogs = [];
    this.solMethodsHashesRepo = solMethodsHashesRepo;
  }

  public async addLog(log: Log) {
    const method = this.solMethodsHashesRepo.get(log.topics[0]) ? this.solMethodsHashesRepo.get(log.topics[0]) as SolMethod : UnknownSolMethod;
    const logObject = new EthLog(log, this.provider, {method});
    this.ethLogs.push(logObject);
    await logObject.extractData();
  }

  public getLogs() {
    return this.ethLogs;
  }
}
