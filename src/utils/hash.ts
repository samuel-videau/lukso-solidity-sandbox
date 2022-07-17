import keccak256 from 'keccak256';

export async function getFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = evt => {
            if (evt.target && evt.target.readyState === FileReader.DONE) {
                const arrayBuffer = evt.target.result as ArrayBuffer;
                const array = new Uint8Array(arrayBuffer);

                resolve(keccak256(array.join('')).toString('hex'));
            } else {
                reject('Error while reading');
            }
        };
    });
}
