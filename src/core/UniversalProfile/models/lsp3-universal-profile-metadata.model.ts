import { Link, MetadataImage } from './metadata-objects.model';

export interface LSP3UniversalProfileMetadata {
    name: string;
    description: string;
    links: Link[];
    tags: string[];
    profileImage: MetadataImage[];
    backgroundImage: MetadataImage[];
}

export function initialUniversalProfile(): LSP3UniversalProfileMetadata {
    return {
        name: '',
        description: '',
        links: [],
        tags: [],
        profileImage: [],
        backgroundImage: []
    };
}

export interface LSP3Profile {
    LSP3Profile: LSP3UniversalProfileMetadata;
}
