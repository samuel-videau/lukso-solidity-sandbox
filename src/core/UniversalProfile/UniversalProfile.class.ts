import Web3 from "web3";
import {Contract} from "web3-eth-contract";
import {AbiItem} from 'web3-utils';
import LSP6KeyManagerArtifact from './abi/LSP6KeyManager.json';

import {Permissions, UniversalProfileReader} from "./UniversalProfileReader.class";
import {generatePermissionKey} from "./utils/generate-permission-key";

enum ERC725OperationType {
  call,
  create,
  create2,
  staticCall,
  delegateCall
}

export class UniversalProfile extends UniversalProfileReader {

  private _eoa: string = '';
  private _keyManagerAddress: string = '';

  public async initialize() {
    await super.initialize();

    this._web3.eth.getAccounts().then(res => {
      this._eoa = res[0];
    });

    await this.fetchKeyManagerAddress();
  }

  public async setData(keys: string[], values: string[]) {
    const bytecode = this._contract.methods.setData(keys, values).encodeABI();
    await this.executeWithKeyManager(bytecode, this._web3);
  }

  public async execute(type: ERC725OperationType, to: string, value: number, bytecode: string): Promise<any> {
    if (this.hasKeyManager()) {
      const upExecutionBytes = this._contract.methods.execute(type, to, value, bytecode).encodeABI();
      return await this.executeWithKeyManager(this._eoa, upExecutionBytes);
    } else {
      const eoa: string = this._eoa;
      return await this._contract.methods.execute(type, to, value, bytecode).send({eoa});
    }
  }

  public async setPermissionsTo(address: string, permissions: Permissions | 'full'): Promise<void> {
    const permissionsKey = permissions === 'full' ? '0x000000000000000000000000000000000000000000000000000000000000ffff' : this._erc725.encodePermissions(permissions);
    await this.setData([generatePermissionKey(address)], [permissionsKey]);
  }

  private async fetchKeyManagerAddress(): Promise<void> {
    this._keyManagerAddress = await this._contract.methods.owner().call();
  }

  private async executeWithKeyManager(bytes: string, web3: Web3): Promise<any> {
    const contract: Contract = new web3.eth.Contract(LSP6KeyManagerArtifact.abi as AbiItem[], this._keyManagerAddress);
    const eoa: string = this._eoa;
    return await contract.methods.execute(bytes).send({ from: eoa });
  }

  private hasKeyManager(): boolean {
    return this._keyManagerAddress !== this._eoa;
  }
}
