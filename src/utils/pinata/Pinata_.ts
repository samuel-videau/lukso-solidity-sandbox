import pinataKey from "./pinataKey.json"

export const Pinata = {
    async testPinata() {
        let request = new Request("https://api.pinata.cloud/data/testAuthentication")
        request.headers.append("Authorization" , "Bearer "+pinataKey.JWT);
        console.log(await fetch(request));
    },

    async pinText(text: string) {
    let post =  text;
    const formData = new FormData();
    var blob = new Blob([post], {type: "application/json"});
    formData.append("file", blob)

    console.log(blob)

    let request = new Request(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        { 
            headers: {
                "Authorization": "Bearer "+pinataKey.JWT,
            },
            method: "POST",
            body: formData
        }
    )

    console.log("Hello before fetch")
    const response = (await fetch(request));
    console.log(await response.json())
    }
}