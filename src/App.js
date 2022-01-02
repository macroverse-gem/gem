import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, constants, ethers, utils } from "ethers";
import LoadingButton from "@mui/lab/LoadingButton";
import ERC721 from "@openzeppelin/contracts/build/contracts/ERC721Enumerable.json";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";

import svg64 from "svg64";
import renderGEM from "./components/renderGEM";
import NFTItem from "./components/NFTItem";

import WalletConnector from "./components/WalletConnector";
import { USDT_CONTRACT, GEM_CONTRACT, QUARRY_CONTRACT, ABI } from "./constants";
import demo from "./demo.svg";
import "./App.css";

function App() {
  const { account, chainId, activate, library, deactivate } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [balance, setBalance] = useState(0);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (account && library) {
      fetchBalance();
      fetchNFT();
    }
  }, [account, library]);
  async function fetchBalance() {
    const usdt = new Contract(USDT_CONTRACT, ERC20.abi, library.getSigner());
    const res = await usdt.balanceOf(account);
    const allowance = await usdt.allowance(account, QUARRY_CONTRACT);
    setApproved(allowance.gt(20));
    setBalance(res);
  }
  async function fetchNFT() {
    console.log("🚀 ~ file: App.js ~ line 40 ~ fetchNFT ~ fetchNFT", fetchNFT);
    const gem = new Contract(GEM_CONTRACT, ERC721.abi, library.getSigner());
    const total = await gem.balanceOf(account);
    let tokenIds = [];
    if (total.toNumber() > 0) {
      for (let index = 0; index < total.toNumber(); index++) {
        const tokenId = await gem.tokenOfOwnerByIndex(account, index);
        tokenIds.push(tokenId);
      }
    }

    setItems(tokenIds);
  }

  async function handleMint() {
    try {
      setLoading(true);
      const quarry = new Contract(QUARRY_CONTRACT, ABI.QUARRY, library.getSigner());

      const receipt = await quarry.mint({ gasLimit: 1000000 });
      await receipt.wait(1);
      fetchNFT();
      fetchBalance();
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    try {
      setLoadingApprove(true);
      const usdt = new Contract(USDT_CONTRACT, ERC20.abi, library.getSigner());

      const receipt = await usdt.approve(QUARRY_CONTRACT, constants.MaxUint256);
      await receipt.wait(1);
    } finally {
      setLoadingApprove(false);
    }
  }

  useEffect(() => {
    async function fetchBalance() {
      const usdt = new Contract(USDT_CONTRACT, ABI.ERC20, library.getSigner());
      const res = await usdt.balanceOf(account);
      setBalance(res);
    }
    if (account && library) {
      fetchBalance();
      fetchNFT();
    }
  }, [account, library]);
  return (
    <div className="App">
      <nav>
        <WalletConnector />
      </nav>
      <header className="App-header">
        <h1>GEM Quarry</h1>
        <img src={demo} className="App-logo" alt="logo" />
      </header>
      <main>
        {approved ? (
          <LoadingButton loading={loading} loadingIndicator="Loading..." sx={{ margin: 10 }} variant="contained" onClick={handleMint}>
            Mint
          </LoadingButton>
        ) : (
          <LoadingButton loading={loadingApprove} sx={{ margin: 10 }} variant="contained" onClick={handleApprove}>
            Approve USDT
          </LoadingButton>
        )}
        <Box sx={{ margin: "10px" }}>Your Balance: {utils.formatEther(balance || 0)} USDT</Box>
        <h1>Your NFTs</h1>
        <Box sx={{ margin: "10px", textAlign: "left" }}>
          {items.map((item) => (
            <NFTItem tokenId={item} />
          ))}
        </Box>
      </main>
    </div>
  );
}

export default App;
