import {EthLog} from "./EthLog.class";
import {Log, SolEvent, UNKNOWN_SOL_EVENT} from "./EthLog.models";

export class EthLogs {

  private readonly solEventsRepo: Map<string, SolEvent>;
  private readonly provider: string;
  private readonly ethLogs: Array<EthLog>;

  constructor(solEventsRepo: Map<string, SolEvent>, provider: string) {
    this.provider = provider;
    this.ethLogs = [];
    this.solEventsRepo = solEventsRepo;
  }

  public async addLog(log: Log) {
    const method = this.solEventsRepo.get(log.topics[0]) ? this.solEventsRepo.get(log.topics[0]) as SolEvent : UNKNOWN_SOL_EVENT;
    const logObject = new EthLog(log, this.provider, {method});
    this.ethLogs.push(logObject);
    await logObject.extractData();
  }

  public getLogs() {
    return this.ethLogs;
  }
}
