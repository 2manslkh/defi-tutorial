import { Tabs, Tab } from "react-bootstrap";
import dBank from "../abis/dBank.json";
import Token from "../abis/Token.json";
import React, { Component } from "react";

import dbank from "../dbank.png";
import Web3 from "web3";
import "./App.css";

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: "undefined",
      account: "",
      token: null,
      dBank: null,
      balance: 0,
      dBankAddress: null,
    };
  }

  async componentWillMount() {
    await this.loadWeb3(this.props.dispatch);
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadWeb3(dispatch) {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      const acc = await web3.eth.getAccounts();
      console.log(acc);
      await window.ethereum.enable();
      this.setState({ web3: web3 });
      console.log("Using window.ethereum");
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      console.log("Using window.web3");
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData(dispatch) {
    const web3 = this.state.web3;
    const acc = await web3.eth.getAccounts();
    const netId = await web3.eth.net.getId();
    const net = await web3.eth.net;
    const balance = await web3.eth.getBalance(acc[0]);
    this.setState({ account: acc[0], balance: balance, web3: web3 });

    console.log(acc);
    console.log(this.state.balance);
    console.log(net);
    console.log(netId);
    try {
      const token = new web3.eth.Contract(
        Token.abi,
        Token.networks[netId].address
      );

      const dbank = new web3.eth.Contract(
        dBank.abi,
        dBank.networks[netId].address
      );
      const dBankAddress = dBank.networks[netId].address;
      this.setState({ token: token, dBank: dbank, dBankAddress: dBankAddress });

      console.log(dBankAddress);
    } catch (e) {
      console.log("Error", e);
      window.alert("Contracts cannot be found on the current network");
    }
  }
  // this.setState({ account: acc[0] });
  // window.addEventListener("load", async () => {
  //   // Modern dapp browsers...
  //   if (typeof window.ethereum !== "undefined") {
  //     window.web3 = new Web3(ethereum);
  //     try {
  //       await ethereum.enable();
  //       var accounts = await web3.eth.getAccounts();
  //       console.log(accounts[0]);
  //     } catch (error) {
  //       // User denied account access...
  //     }
  //   } else {
  //     window.alert("Please install metamask");
  //   }
  // });
  // if (typeof window.ethereum !== "undefined") {
  //   window.ethereum.enable();
  //   const netId = await web3.eth.net.getId();
  //   const accounts = await web3.eth.getAccounts();
  //   // console.log(netId);
  //   // console.log(accounts[0]);
  //   if (typeof accounts[0] !== "undefined") {
  //     const balance = await web3.eth.getBalance(accounts[0]);
  //     this.setState({ accounts: accounts[0], balance: balance, web3: web3 });
  //   } else {
  //     window.alert("Please install metamask");
  //   }
  // } else {
  //   window.alert("Please install metamask");
  // }
  //check if MetaMask exists
  //assign to values to variables: web3, netId, accounts
  //check if account is detected, then load balance&setStates, elsepush alert
  //in try block load contracts
  //if MetaMask not exists push alert
  // }

  async deposit(amount) {
    console.log(amount);
    this.state.dBank.methods
      .deposit()
      .send({ value: amount.toString(), from: this.state.account });
  }

  async withdraw(e) {
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  render() {
    return (
      <div className="text-monospace">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={dbank} className="App-logo" alt="logo" height="32" />
            <b>dBank</b>
          </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
          <br></br>
          <h1>Welcome to dBank</h1>
          <h2>
            {this.state.account} {this.state.balance}
          </h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                  <Tab eventKey="deposit" title="Deposit">
                    <div>
                      <br></br>
                      How much do you want to deposit?
                      <br></br>
                      min. amount 0.01 ETH?
                      <br></br>
                      How much do you want to deposit?
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          let amount = this.depositAmount.value;
                          amount = amount * 10 ** 18;
                          this.deposit(amount);
                        }}
                      >
                        <div className="form-group mr-sm-2">
                          <br></br>
                          <input
                            id="depositAmount"
                            step="0.01"
                            type="number"
                            className="form-control form-control-md"
                            placeholder="amount..."
                            required
                            ref={(input) => {
                              this.depositAmount = input;
                            }}
                          />
                          <button type="submit" className="btn btn-primary">
                            DEPOSIT
                          </button>
                        </div>
                      </form>
                    </div>
                  </Tab>
                  <Tab eventKey="withdraw" title="Withdraw">
                    <div>
                      <br></br>
                      Withdraw?
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
