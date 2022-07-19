import { ERC725JSONSchema } from '@erc725/erc725.js';
import {Lsp3UniversalProfileSchema} from "../UniversalProfile/schemas/Lsp3UniversalProfile.schema";
import {Lsp4DigitalAssetSchema} from "../UniversalProfile/schemas/Lsp4DigitalAsset.schema";

export const InterfaceToSchema: Map<string, ERC725JSONSchema[]> = new Map<string, ERC725JSONSchema[]>();

InterfaceToSchema.set('LSP0',
   Lsp3UniversalProfileSchema
);
InterfaceToSchema.set('LSP7',
    Lsp4DigitalAssetSchema
);
InterfaceToSchema.set('LSP8',
    Lsp4DigitalAssetSchema
);