import { ethers } from "ethers";
import React, { useState } from "react";
import ERC20JSON from "./api/ERC20JSON";
import bytecode from "./api/bytecode";



const Home = () => {

  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [signer, setSigner] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');

  async function connectWallet () {
    try {
      const providers = new ethers.providers.Web3Provider(window.ethereum);
      await providers.send("eth_requestAccounts", []);
      const signer = await providers.getSigner();
      setSigner(signer);
      console.log(signer);
      const network = await providers.getNetwork();

      setProvider(providers);
      setNetwork(network);
    } catch (error) {
      console.log("Error Message: ", error);
    }
  }

  async function handleDeploy(event) {
    event.preventDefault();
    

    if (!provider || !network) {
      console.log("Please connect your wallet before deploying the contract.");
      return;
    }

    try {
      const factory = new ethers.ContractFactory(ERC20JSON, bytecode, signer);
      const name = tokenName;
      const symbol = tokenSymbol;
      const supply = ethers.utils.parseEther(totalSupply);
      const owner = await signer.getAddress();
      const contract = await factory.deploy(name, symbol, supply, owner);
      await contract.deployed();
      setDeployedAddress(contract.address);
    } catch (error) {
      console.log(error);
    }
  }

  function handleTokenNameChange(event) {
    setTokenName(event.target.value);
    console.log(event.target.value);
  }

  function handleTokenSymbolChange(event) {
    setTokenSymbol(event.target.value);
    console.log(event.target.value);
  }

  function handleTotalSupplyChange(event) {
    setTotalSupply(event.target.value);
    console.log(event.target.value);
  }

  return (
  <div className="bg-gray-100 py-10 px-4">
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div>
          {provider && network ? (
            <p className="text-gray-700 mb-2">
            Wallet Connected to {network.name} network 
            </p>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-gray-700">
        ERC20 Token Deployment
        </h2>
        </div>
        <form className="p-4" onSubmit={handleDeploy}>
          <div className="mb-4">
            <label 
            className="block text-gray-700 font-bold mb-2"
            htmlFor="name"
            >
            Token Name:
            </label>
            <input
            className="border border-gray-400 p-2 w-full rounded-lg"
            type="text"
            placeholder="Enter Token Name"
            id="name" onChange={handleTokenNameChange}
            />
          </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="symbol"
        >
          Token Symbol:
        </label>
        <input
          className="border border-gray-400 p-2 w-full rounded-lg"
          type="text"
          placeholder="Enter Token Symbol"
          id="symbol" onChange={handleTokenSymbolChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="totalSupply"
        >
          Total Supply:
        </label>
        <input
          className="border border-gray-400 p-2 w-full rounded-lg"
          type="text"
          placeholder="Enter Total Supply"
          id="totalSupply" onChange={handleTotalSupplyChange}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Deploy Token
      </button>
    </form>
    {deployedAddress && <p>Contract deployed at address: {deployedAddress}</p>}
  </div>
</div>
  );
}

export default Home;