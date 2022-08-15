import {Contract} from "web3-eth-contract";
import {AbiItem, bytesToHex} from 'web3-utils';
import LSP6KeyManagerArtifact from './abi/LSP6KeyManager.json';

import {Permissions, UniversalProfileReader} from "./UniversalProfileReader.class";
import {generatePermissionKey} from "./utils/generate-permission-key";
import {ADDRESS0} from "../../utils/address0";
import {TransactionData} from "../../models/transaction-data";
import { web3 } from "../web3";

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

    const permissionsArrayKey = this._web3.utils.keccak256("AddressPermissions[]");
    const utils = this._web3.utils;
    try {

      let permissionsLength = (await this.getDataUnverified([permissionsArrayKey]))[0];
      let newLengthUnpadded = utils.numberToHex(utils.hexToNumber(permissionsLength) + 1)
      let newLengthPadded = utils.padLeft( newLengthUnpadded, 66-newLengthUnpadded.length+1);
      console.log("New length: "+newLengthPadded)
      console.log("AddressPermissions[] value: "+permissionsLength);

      /*const lengthData = this._erc725.encodeData([{
        keyName: "AddressPermissions[]",
        value: newLengthPadded
      }])*/

      const permissionsData = this._erc725.encodeData([{
        keyName: "AddressPermissions:Permissions:<address>",
        dynamicKeyParts: address,
        value: permissionsKey
      }])

      let paddedIndex = web3.utils.padLeft(web3.utils.numberToHex(permissionsLength), 34 - web3.utils.numberToHex(permissionsLength).length + 1)

      let keys:string[] = [];
      let values:string[] = [];
      // 1. Updates AddressPermissions[] length
      keys.push(utils.keccak256("AddressPermissions[]"));
      values.push(newLengthPadded);
      // 2. Updates AddressPermissions[i] value
      keys.push(utils.keccak256("AddressPermissions[]").slice(0,34) + paddedIndex.slice(2));
      values.push(address);
      // 3. Updates address permissions in the mapping
      keys = keys.concat(permissionsData.keys);
      values = values.concat(permissionsData.values);
      console.log(keys);
      console.log(values)
      await this._contract.methods.setData(keys, values).send({from: this._eoa}); 

      /*await this._contract.methods.setData([utils.keccak256("AddressPermissions[]")], [newLengthPadded]).send({from: this._eoa}); 
      await this._contract.methods.setData([utils.keccak256("AddressPermissions[]").slice(0,34) + paddedIndex.slice(2)], [address]).send({from: this._eoa}); // 2. Updates AddressPermissions[i] value
      await this._contract.methods.setData(permissionsData.keys, permissionsData.values).send({from: this._eoa}); // 3. Updates address permissions in the mapping*/

    } catch (error:any) {
      console.error("Failed to set permissions: "+error.message)
    }
  }

  private async fetchKeyManagerAddress(): Promise<void> {
    this._keyManagerAddress = await this._contract.methods.owner().call();
    console.log("KeyManager address: "+this._keyManagerAddress);
  }

  private async executeWithKeyManager(bytes: string): Promise<TransactionData> {
    const contract: Contract = new this._web3.eth.Contract(LSP6KeyManagerArtifact.abi as AbiItem[], "0x2cA2f608A79A6B2c7B62721E4Bf58D5D8d5B5da7"/*this._keyManagerAddress*/);
    const eoa: string = this._eoa;
    console.log("About to transfer control to wallet. EOA: "+eoa)
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
