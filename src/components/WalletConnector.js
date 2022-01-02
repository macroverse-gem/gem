import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Button, Box, Chip } from "@mui/material";

const injected = new InjectedConnector({ supportedChainIds: [1, 4, 56, 97] });

function shortenAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(addr.length - 6);
}
function transformChainName(chainId) {
  const CHAIN_NAME = {
    1: "ETH",
    3: "ROPSTEN",
    4: "RINKEBY",
    56: "BSC",
    97: "BNS_TESTNET",
    1337: "LOCAL",
  };
  const id = Number(chainId);
  return CHAIN_NAME[id] ?? chainId;
}

function WalletConnector() {
  const { account, chainId, activate, library, deactivate } = useWeb3React();

  // 首次渲染自动连接钱包
  useEffect(() => {
    activate(injected);
  }, []);

  return (
    <Box>
      {account ? (
        <>
          {chainId && <Chip label={transformChainName(chainId)} />}
          <Chip label={shortenAddress(account)} />
          <Button variant="contained" onClick={() => deactivate()}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={() => activate(injected)}>
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}
export default React.memo(WalletConnector);
