import { useState, useEffect } from 'react';
import VendingMachine from './contracts/VendingMachine.json'; // My compiled contract JSON
import Web3 from 'web3';
import './App.css';

function App() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
    accounts: null,
  });
  const [vendingBalance, setVendingBalance] = useState(0);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');

    async function loadContract() {
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VendingMachine.networks[networkId];
      const contract = new web3.eth.Contract(VendingMachine.abi, deployedNetwork.address);
      setState({ web3: web3, contract: contract, accounts: accounts });
      const balance = await contract.methods.getVendingMachineBalance().call();
      setVendingBalance(balance);
    }
    provider && loadContract();
  }, []);

  // Restock vending machine
  async function restockMachine() {
    const { contract, accounts } = state;
    const restockAmount = document.querySelector('#restockAmount').value;
    await contract.methods.restock(restockAmount).send({ from: accounts[0] });
    window.location.reload();
  }

  // Purchase from vending machine
  async function purchaseDonuts() {
    const { contract, accounts } = state;
    const purchaseAmount = document.querySelector('#purchaseAmount').value;
    await contract.methods.purchase(purchaseAmount).send({
      from: accounts[0],
      value: Web3.utils.toWei((2 * purchaseAmount).toString(), 'ether'),
    });
    window.location.reload();
  }

  return (
    <>
      <h1>Vending Machine DApp</h1>
      <div className="App">
        <p>Vending Machine Balance: {vendingBalance} Cold-Drinks</p>
        <p className="Note">Note : Each Cold-Drinks cost 2 ETh</p>

        <div>
          <h3>Restock Vending Machine</h3>
          <input type="number" id="restockAmount" placeholder="Amount to Restock"></input>
          <button onClick={restockMachine}>Restock</button>
        </div>

        <div>
          <h3>Purchase Cold-Drinks</h3>
          <input type="number" id="purchaseAmount" placeholder="Amount to Purchase"></input>
          <button onClick={purchaseDonuts}>Purchase</button>
        </div>
      </div>
    </>
  );
}

export default App;
