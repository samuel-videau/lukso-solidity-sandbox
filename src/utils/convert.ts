export function numberToBytes32(nbr: number): string {
    let bytes = '0x0000000000000000000000000000000000000000000000000000000000000000';
    bytes = bytes.substring(0, 66 - nbr.toString().split('').length);
    bytes += nbr.toString();
    return bytes;
}
