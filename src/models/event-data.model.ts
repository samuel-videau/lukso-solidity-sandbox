export interface EventData {
    returnValues: {
        [key: string]: any;
    };
    raw: {
        data: string;
        topics: string[];
    };
    event: string;
    signature: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
}