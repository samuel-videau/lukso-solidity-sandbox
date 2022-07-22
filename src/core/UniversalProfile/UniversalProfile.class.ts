import {Contract} from "web3-eth-contract";
import {AbiItem} from 'web3-utils';
import LSP6KeyManagerArtifact from './abi/LSP6KeyManager.json';

import {Permissions, UniversalProfileReader} from "./UniversalProfileReader.class";
import {generatePermissionKey} from "./utils/generate-permission-key";
import {ADDRESS0} from "../../utils/address0";
import {TransactionData} from "../../models/transaction-data.model";

export enum ERC725XOperationType {
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
    await this.executeWithKeyManager(bytecode);
  }

  public async execute(type: ERC725XOperationType, value: number, bytecode: string, to?: string): Promise<TransactionData> {
    const addressTo = to ? to : ADDRESS0;
    if (this.hasKeyManager()) {
      const upExecutionBytes = this._contract.methods.execute(type , addressTo, value, bytecode).encodeABI();
      return await this.executeWithKeyManager(upExecutionBytes);
    } else {
      const eoa: string = this._eoa;
      return await this._contract.methods.execute(type, addressTo, value, bytecode).send({eoa}) as TransactionData;
    }
  }

  public getBytecodeExecution(type: ERC725XOperationType, value: number, bytecode: string, to?: string): string {
    const addressTo = to ? to : ADDRESS0;
    if (this.hasKeyManager()) {
      const upExecutionBytes = this._contract.methods.execute(type, addressTo, value, bytecode).encodeABI();
      return this.getBytecodeOfExecutionWithKeyManager(upExecutionBytes);
    } else {
      return this._contract.methods.execute(type, addressTo, value, bytecode).encodeABI();
    }
  }

  public async setPermissionsTo(address: string, permissions: Permissions | 'full'): Promise<void> {
    const permissionsKey = permissions === 'full' ? '0x000000000000000000000000000000000000000000000000000000000000ffff' : this._erc725.encodePermissions(permissions);
    await this.setData([generatePermissionKey(address)], [permissionsKey]);
  }

  private async fetchKeyManagerAddress(): Promise<void> {
    this._keyManagerAddress = await this._contract.methods.owner().call();
  }

  private async executeWithKeyManager(bytes: string): Promise<TransactionData> {
    const contract: Contract = new this._web3.eth.Contract(LSP6KeyManagerArtifact.abi as AbiItem[], this._keyManagerAddress);
    const eoa: string = this._eoa;
    return await contract.methods.execute(bytes).send({ from: eoa }) as TransactionData;
  }

  private getBytecodeOfExecutionWithKeyManager(bytes: string): string {
    const contract: Contract = new this._web3.eth.Contract(LSP6KeyManagerArtifact.abi as AbiItem[], this._keyManagerAddress);
    return contract.methods.execute(bytes).encodeABI();
  }

  private hasKeyManager(): boolean {
    return this._keyManagerAddress !== this._eoa;
  }
}
