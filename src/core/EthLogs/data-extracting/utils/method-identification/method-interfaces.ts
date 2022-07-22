interface MethodInterface {
    id: string,
    name: string
}

const methodInterfaces: MethodInterface[] = [
    {id: '0x9a3bfe88', name: 'Universal Profile'},
];

const methodIdToInterface: Map<string, MethodInterface> = new Map(methodInterfaces.map(methodInterface => {
    return [methodInterface.id, methodInterface];
}))

const UNKNOWN_INTERFACE: MethodInterface = {id: '0x', name: 'Unknown'}

export {methodIdToInterface, UNKNOWN_INTERFACE};
export type { MethodInterface };
