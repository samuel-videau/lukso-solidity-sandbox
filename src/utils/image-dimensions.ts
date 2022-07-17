export async function getImageDimensions(url: string): Promise<{ height: number; width: number }> {
    return new Promise(resolve => {
        const img = new Image();
        img.src = url;

        img.onload = function () {
            resolve({ height: img.height, width: img.width });
        };
    });
}
