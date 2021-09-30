import React, { useEffect, useState } from "react";
import { request } from "graphql-request";
import { Gotchi, QueryResponse } from "./types/index";
import { GotchiListing } from "./components/GotchiListing";
import { SelectedGotchi } from "./components/SelectedGotchi";
import Web3 from "web3";
import diamondABI from "./abi/diamondABI.json";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils/types";
import "./App.css";

const uri =
  "https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic";

const diamondAddress = "0x86935F11C86623deC8a25696E1C19a8659CbF95d";

function App() {
  const [gotchis, setGotchis] = useState<Array<Gotchi>>([]);
  const [selectedGotchi, setSelectedGotchi] = useState<number>(0);
  const [contract, setContract] = useState<Contract | null>(null);
  const [collaterals, setCollaterals] = useState([]);

  const connectToWeb3 = () => {
    const web3 = new Web3(Web3.givenProvider);
    const aavegotchiContract = new web3.eth.Contract(
      diamondABI as AbiItem[],
      diamondAddress
    );
    setContract(aavegotchiContract);
  };

  const fetchGotchis = async () => {
    const query = `
    {
     aavegotchis(first: 100, orderBy: gotchiId) {
       id
       name
       collateral
       withSetsNumericTraits
     }
   }
   `;
    const response = await request<QueryResponse>(uri, query);
    setGotchis(response.aavegotchis);
  };

  useEffect(() => {
    fetchGotchis();
    connectToWeb3();
  }, []);

  // useEffect(() => {
  //   if (!!contract) {
  //     const fetchAavegotchiCollaterals = async () => {
  //       const collaterals = await contract.methods.getCollateralInfo().call();
  //       setCollaterals(collaterals);
  //     };
  //     fetchAavegotchiCollaterals();
  //   }
  // }, [contract]);

  return (
    <div className="App">
      <div className="container">
        <div className="selected-container">
          {gotchis.length > 0 && (
            <SelectedGotchi
              name={gotchis[selectedGotchi].name}
              traits={gotchis[selectedGotchi].withSetsNumericTraits}
            />
          )}
        </div>
        <div className="gotchi-list">
          {gotchis.map((gotchi, i) => (
            <GotchiListing
              key={gotchi.id}
              id={gotchi.id}
              name={gotchi.name}
              collateralColor="black"
              // selectGotchi={() => null}
              // selected={false}
              selectGotchi={() => setSelectedGotchi(i)}
              selected={i === selectedGotchi}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
