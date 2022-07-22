interface MethodInterface {
    id: string,
    name: string
}

const methodInterfaces: MethodInterface[] = [
    {id: '0x7f23690c', name: 'SetData'},
    {id: '0x14a6e293', name: 'SetData'},
];

const methodIdToInterface: Map<string, MethodInterface> = new Map(methodInterfaces.map(methodInterface => {
    return [methodInterface.id, methodInterface];
}))

const UNKNOWN_METHOD_INTERFACE: MethodInterface = {id: '0x', name: 'Unknown'}

export {methodIdToInterface, UNKNOWN_METHOD_INTERFACE};
export type { MethodInterface };
