import {Link, MetadataAsset, MetadataImage} from '../../../models/metadata-objects.model';

export interface Lsp4DigitalAsset {
    description: string;
    links: Link[];
    icon: MetadataAsset;
    images: MetadataImage[];
    assets: MetadataAsset[];
}

export function initialUniversalProfile(): Lsp4DigitalAsset {
    return {
        description: '',
        links: [],
        icon: {
            url: '',
            hash: '',
            hashFunction: '',
            fileType: ''
        },
        images: [],
        assets: []
    };
}
