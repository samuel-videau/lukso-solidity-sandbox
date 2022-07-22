import {HashToSolMethod, SolMethod} from "../../EthLogs/EthLog.models";
export const UniversalProfileLogTypes: HashToSolMethod = new Map<string, SolMethod>();

UniversalProfileLogTypes.set('0x01c42bd7e97a66166063b02fce6924e6656b6c2c61966630165095c4fb0b7b2f',
  {name: 'ContractCreated', parameters:
      [
          {name: 'operation', type: 'uint256', indexed: true},
          {name: 'contractAddress', type: 'address', indexed: true},
          {name: 'value', type: 'uin256', indexed: true},
      ]
  }
);

UniversalProfileLogTypes.set('0xcdf4e344c0d23d4cdd0474039d176c55b19d531070dbe17856bfb993a5b5720b',
  {name: 'DataChanged', parameters:
      [
          {name: 'key', type: 'bytes32', indexed: true},
      ]
  }
);

UniversalProfileLogTypes.set('0xece574603820d07bc9b91f2a932baadf4628aabcb8afba49776529c14a6104b2',
    {name: 'DataChanged', parameters:
            [
                {name: 'key', type: 'bytes32', indexed: true},
                {name: 'value', type: 'bytes', indexed: false},
            ]
    }
);

UniversalProfileLogTypes.set('0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
    {name: 'OwnershipTransferred', parameters:
        [
            {name: 'previousOwner', type: 'address', indexed: true},
            {name: 'newOwner', type: 'address', indexed: true},
        ]
    }
);

UniversalProfileLogTypes.set('0x1f920dbda597d7bf95035464170fa58d0a4b57f13a1c315ace6793b9f63688b8',
    {name: 'Executed', parameters:
        [
            {name: 'operation', type: 'uint256', indexed: true},
            {name: 'to', type: 'address', indexed: true},
            {name: 'value', type: 'uint256', indexed: true},
            {name: 'data', type: 'bytes', indexed: false},
        ]
    }
);

UniversalProfileLogTypes.set('0x4810874456b8e6487bd861375cf6abd8e1c8bb5858c8ce36a86a04dabfac199e',
    {name: 'Executed', parameters:
            [
                {name: 'operation', type: 'uint256', indexed: true},
                {name: 'to', type: 'address', indexed: true},
                {name: 'value', type: 'uint256', indexed: true},
                {name: 'selector', type: 'bytes4', indexed: false},
            ]
    }
);

UniversalProfileLogTypes.set('0x8187df79ab47ad16102e7bc8760349a115b3ba9869b8cedd78996f930ac9cac3',
    {name: 'UniversalReceiver', parameters:
            [
                {name: 'from', type: 'address', indexed: true},
                {name: 'typeId', type: 'bytes32', indexed: true},
                {name: 'returnedValue', type: 'bytes', indexed: true},
                {name: 'receivedData', type: 'bytes', indexed: false},
            ]
    }
);

UniversalProfileLogTypes.set('0x54b98940949b5ac0325c889c84db302d4e18faec431b48bdc81706bfe482cfbd',
    {name: 'UniversalReceiver', parameters:
            [
                {name: 'from', type: 'address', indexed: true},
                {name: 'typeId', type: 'bytes32', indexed: true},
                {name: 'returnedValue', type: 'bytes32', indexed: true},
                {name: 'receivedData', type: 'bytes', indexed: false},
            ]
    }
);

UniversalProfileLogTypes.set('0x28dca09fe59e9b92384074cf93fb4789da55b0b2cc3ffa69274eb3c87b7391c6',
    {name: 'ValueReceived', parameters:
            [
                {name: 'sender', type: 'address', indexed: true},
                {name: 'value', type: 'uint256', indexed: true},
            ]
    }
);
