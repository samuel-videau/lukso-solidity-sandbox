import {URLDataWithHash} from "@erc725/erc725.js/build/main/src/types/encodeData/JSONURL";
import { Subscription } from "web3-core-subscriptions";
import {ERC725, ERC725JSONSchema} from "@erc725/erc725.js";
import {Contract} from "web3-eth-contract";
import {AbiItem} from "web3-utils";
import { Log } from "web3-core";
import Web3 from "web3";

import {generatePermissionKey} from "./utils/generate-permission-key";
import {EthLogs} from "../EthLogs/EthLogs.class";
import {UniversalProfileLogTypes} from "./utils/UniversalProfileLogTypes";
import {EthLog} from "../EthLogs/EthLog.class";

import Lsp3UniversalProfileSchema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import UniversalProfileArtifact from "./abi/UniversalProfile.json";
import {initialUniversalProfile, LSP3UniversalProfile} from "./models/lsp3-universal-profile.model";
import { LSPXXSocialMediaSchema } from "./models/LSPXXSocialMedia";

const Lsp6KeyManagerSchema = [
  {
    "name": "AddressPermissions[]",
    "key": "0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3",
    "keyType": "Array",
    "valueType": "address",
    "valueContent": "Address"
  },
  {
    "name": "AddressPermissions:Permissions:<address>",
    "key": "0x4b80742de2bf82acb3630000<address>",
    "keyType": "MappingWithGrouping",
    "valueType": "bytes32",
    "valueContent": "BitArray"
  }
]



interface GetDataDynamicKey {
  keyName: string;
  dynamicKeyParts: string | string[];
}

export interface Permissions {
  CHANGEOWNER: boolean;
  CHANGEPERMISSIONS: boolean;
  ADDPERMISSIONS: boolean;
  SETDATA: boolean;
  CALL: boolean;
  STATICCALL: boolean;
  DELEGATECALL: boolean;
  DEPLOY: boolean;
  TRANSFERVALUE: boolean;
  SIGN: boolean;
}

export interface DecodeDataOutput {
  value: string | string[] | URLDataWithHash;
  name: string;
  key: string;
}

export class UniversalProfileReader {

  protected readonly _address: string;
  protected readonly _erc725: ERC725;
  protected readonly _contract: Contract;

  protected _web3: Web3;
  private _metadata: LSP3UniversalProfile = initialUniversalProfile();
  private _logs: EthLogs = new EthLogs(UniversalProfileLogTypes);
  private _logsSubscription: Subscription<Log>;

  constructor(address: string, ipfsGateway: string, web3: Web3) {
    this._erc725 = new ERC725(Lsp3UniversalProfileSchema.concat(Lsp6KeyManagerSchema).concat(LSPXXSocialMediaSchema) as ERC725JSONSchema[], address, web3.currentProvider, {ipfsGateway})
    this._address = address;
    this._web3 = web3;
    this._contract = new this._web3.eth.Contract(UniversalProfileArtifact.abi as AbiItem[], address);
    this._logsSubscription = web3.eth.subscribe('logs', {
      fromBlock: 0,
      address: this._address,
    });
  }

  get metadata(): LSP3UniversalProfile {
    return this._metadata;
  }

  get address(): string {
    return this._address;
  }

  public async initialize() {
    await this.fetchMetadata();
  }

  public async getData(keys: (string | GetDataDynamicKey)[]): Promise<DecodeDataOutput[]> {
    return await this._erc725.getData(keys);
  }
  public async getDataSolo(key: (string | GetDataDynamicKey)): Promise<DecodeDataOutput> {
    return await this._erc725.getData(key);
  }

  public async getDataUnverified(keys: string[]): Promise<any[]> {
    return await this._contract.methods.getData(keys).call();
  }

  public async fetchData(keys: (string | GetDataDynamicKey)[]): Promise<DecodeDataOutput[]> {
    return await this._erc725.fetchData(keys);
  }

  public async fetchPermissionsOf(address: string): Promise<Permissions | false> {
    try {
      const permissionsValue: string = (await this.getDataUnverified([generatePermissionKey(address)]))[0] as string;
      return ERC725.decodePermissions(permissionsValue);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async subscribeLogs(fromBlock: number): Promise<void> {
    this._logsSubscription = this._web3.eth.subscribe('logs', {
      fromBlock,
      address: this._address,
    });

    this._logsSubscription.subscribe(async (error, res) => {
      if (error) {
        await this._logsSubscription.unsubscribe();
      } else if (res.transactionHash) {
        this._logs.addLog(res);
      }
    })
  }

  public async unsubscribeLogs(): Promise<void> {
    await this._logsSubscription.unsubscribe();
  }

  public getLogs(): EthLog[] {
    return this._logs.getLogs();
  }

  private async fetchMetadata() {
    const data = await this._erc725.fetchData(['LSP3Profile']);
    this._metadata = JSON.parse(JSON.stringify(data[0])).value.LSP3Profile as LSP3UniversalProfile;
  }

  public async getJsonUrlContent(key:string) {
    let jsonUrl = await this.getData([key]);
    return (jsonUrl[0].value as URLDataWithHash).url.slice(5);
  }
  
}
