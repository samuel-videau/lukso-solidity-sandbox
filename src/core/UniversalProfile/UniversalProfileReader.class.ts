import {ERC725} from "@erc725/erc725.js";
import Web3 from "web3";

import {schema} from './schemas/universal-profiles.schema';
import {
  initialUniversalProfile,
  LSP3UniversalProfileMetadata
} from "./models/lsp3-universal-profile-metadata.model";
// import {generatePermissionKey} from "./utils/generate-permission-key";
import {URLDataWithHash} from "@erc725/erc725.js/build/main/src/types/encodeData/JSONURL";
import {Contract} from "web3-eth-contract";
import UniversalProfileArtifact from "./abi/UniversalProfile.json";
import {AbiItem} from "web3-utils";
import {generatePermissionKey} from "./utils/generate-permission-key";

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
  private _metadata: LSP3UniversalProfileMetadata = initialUniversalProfile();

  constructor(address: string, ipfsGateway: string, web3: Web3) {
    this._erc725 = new ERC725(schema, address, web3.currentProvider, {ipfsGateway})
    this._address = address;
    this._web3 = web3;
    this._contract = new this._web3.eth.Contract(UniversalProfileArtifact.abi as AbiItem[], address);
  }

  get metadata(): LSP3UniversalProfileMetadata {
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

  public async getDataUnverified(keys: string[]): Promise<any[]> {
    return await this._contract.methods.getData(keys).call();
  }

  public async fetchData(keys: (string | GetDataDynamicKey)[]): Promise<DecodeDataOutput[]> {
    return await this._erc725.fetchData(keys);
  }

  private async fetchMetadata() {
    const data = await this._erc725.fetchData(['LSP3Profile']);
    this._metadata = JSON.parse(JSON.stringify(data[0])).value.LSP3Profile as LSP3UniversalProfileMetadata;
  }

  async fetchPermissionsOf(address: string): Promise<Permissions | false> {
    try {
      const permissionsValue: string = (await this.getDataUnverified([generatePermissionKey(address)]))[0] as string;
      return ERC725.decodePermissions(permissionsValue);
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
