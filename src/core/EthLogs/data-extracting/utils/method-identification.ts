interface SolMethodInterface {
    id: string,
    name: string,
}

const methodIdentification: SolMethodInterface[] = [
    {id: '0x7f23690c', name: 'SetData'},
    {id: '0x14a6e293', name: 'SetData'},
];

const methodIdToInterface: Map<string, SolMethodInterface> = new Map(methodIdentification.map(methodInterface => {
    return [methodInterface.id, methodInterface];
}))

const UNKNOWN_METHOD_INTERFACE: SolMethodInterface = {id: '0x', name: 'Unknown'}

export {methodIdToInterface, UNKNOWN_METHOD_INTERFACE};
export type { SolMethodInterface };
