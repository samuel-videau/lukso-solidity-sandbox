interface MethodInterface {
    id: string,
    name: string,
    associatedTopics?: string[]
}

const methodInterfaces: MethodInterface[] = [
    {id: '0x7f23690c', name: 'SetData', associatedTopics: ['0xcdf4e344c0d23d4cdd0474039d176c55b19d531070dbe17856bfb993a5b5720b']},
    {id: '0x14a6e293', name: 'SetData', associatedTopics: ['0xcdf4e344c0d23d4cdd0474039d176c55b19d531070dbe17856bfb993a5b5720b']},
];

const methodIdToInterface: Map<string, MethodInterface> = new Map(methodInterfaces.map(methodInterface => {
    return [methodInterface.id, methodInterface];
}))

const UNKNOWN_METHOD_INTERFACE: MethodInterface = {id: '0x', name: 'Unknown'}

export {methodIdToInterface, UNKNOWN_METHOD_INTERFACE};
export type { MethodInterface };
