import {HashToSolMethod, SolMethod} from "../../EthLogs/EthLog.models";
export const UniversalProfileLogTypes: HashToSolMethod = new Map<string, SolMethod>();

UniversalProfileLogTypes.set('0x01c42bd7e97a66166063b02fce6924e6656b6c2c61966630165095c4fb0b7b2f',
  {name: 'ContractCreated', parameters:
      [
        {name: '_operation', type: 'uint256', indexed: true},
        {name: '_contractAddress', type: 'address', indexed: true},
        {name: '_value', type: 'uin256', indexed: true},
      ]}
);

UniversalProfileLogTypes.set('0xcdf4e344c0d23d4cdd0474039d176c55b19d531070dbe17856bfb993a5b5720b',
  {name: 'DataChanged', parameters:
      [
        {name: 'key', type: 'bytes32', indexed: true},
      ]}
);

UniversalProfileLogTypes.set('0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
  {name: 'OwnershipTransferred', parameters:
      [
        {name: 'previousOwner', type: 'address', indexed: true},
        {name: 'newOwner', type: 'address', indexed: true},
      ]}
);
