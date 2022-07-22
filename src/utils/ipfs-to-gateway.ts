export function ipfsToGateway(ipfs: string, gateway: string): string {
    return gateway + ipfs.slice(6);
}