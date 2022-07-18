import React from 'react';
import './App.css';
import {connectProfile, signMessage, web3} from "./core/web3";
import {deployUP} from "./core/lukso/up-factory";
import {UniversalProfile} from "./core/UniversalProfile/UniversalProfile.class";
import {EthLog} from "./core/EthLogs/EthLog.class";
import LSP7AssetArtifact from './assets/artifacts/LSP7Asset.json';

function App() {

  async function testUPClass() {
    const universalProfile = new UniversalProfile("0xEd878fCaA2D94c22CC947a6637B8eC0a2c541A18", 'https://2eff.lukso.dev/ipfs/', web3);
    await universalProfile.initialize();
    // console.log(universalProfile.metadata);
    // console.log(universalProfile.address);
    // console.log(await universalProfile.fetchData(['0xeafec4d89fa9619884b60000abe425d64acd861a49b8ddf5c0b6962110481f38']));
    // console.log(await universalProfile.getData(['0xeafec4d89fa9619884b60000abe425d64acd861a49b8ddf5c0b6962110481f38']));
    // console.log(await universalProfile.fetchPermissionsOf('0xD692Ba892a902810a2EE3fA41C1D8DcD652D47Ab'));
    // await universalProfile.setPermissionsTo('0x0C92EC41A0Aba4F33B69dA6a931A7F74C309d143', 'full');
    // console.log(await universalProfile.fetchPermissionsOf('0x742b9DcaBE38f05CE619002029251a00F5dd0c6d'));
    await universalProfile.subscribeLogs(0);
    setTimeout(() => {
      const logs: EthLog[] = universalProfile.getLogs();
      console.log('============LOGS============');
      console.log('Total of logs: ' + logs.length);
      console.log('\n\n\n');
      logs.forEach(log => {
        console.log('==============EVENT==============');
        console.log('Name: ' + log.getName());
        console.log(log.getParameters());
        console.log(log.getLog());
      })
    }, 6);
  }

  return (
    <div>
      <button onClick={() => {connectProfile()}}>Connect</button>
      <button onClick={() => {signMessage()}}>Sign</button>
      <button onClick={() => {deployUP()}}>Deploy UP</button>
      <button onClick={() => {
        testUPClass()}}>Deploy UP</button>
    </div>
  );
}

export default App;
