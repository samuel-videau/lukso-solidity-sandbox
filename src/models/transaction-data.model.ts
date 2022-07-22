import {EventData} from "./event-data.model";

export interface TransactionData {
    events: EventData[];
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    contractAddress: string;
    cumulativeGasUsed: number;
    effectiveGasPrice: number;
    from: string;
    gasUsed: number;
    logsBloom: string;
    status: boolean;
    to: string;
    type: string;
}
