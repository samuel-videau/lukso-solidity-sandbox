import { ERC725JSONSchema } from "@erc725/erc725.js";

export const LSPXXSocialMediaSchema:ERC725JSONSchema[] = [
    {
        "name": "SupportedStandards:LSPXXSocialMedia",
        "key": "0xeafec4d89fa9619884b60000ffe045c9ce71f188fa66a14a382f1655922221bf",
        "keyType": "Mapping",
        "valueType": "bytes4",
        "valueContent": "0xabe425d6"
    }, 
    {
        "name": "LSPXXSocialRegistry",
        "key": "0x661d289e41fcd282d8f4b9c0af12c8506d995e5e9e685415517ab5bc8b908247",
        "keyType": "Singleton",
        "valueType": "bytes",
        "valueContent": "JSONURL"
    },
]