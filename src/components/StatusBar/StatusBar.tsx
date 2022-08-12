import "./StatusBar.css"


export const StatusBar = ({address, balance}: {address: string, balance:string}) => {
    
    return (
    <div className="statusBar">
        <p>Transactions sent through Address: {address}</p>
        <p>Balance: {balance}</p>
    </div>
    )

}
