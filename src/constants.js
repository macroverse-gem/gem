export const QUARRY_CONTRACT = "0x1a45d43d34D004036d99520E79AA1130eAc37Bd8";
export const GEM_CONTRACT = "0x3a3cCc5089c6E6E93ebE438a0a680Cea7Af310c9";
export const USDT_CONTRACT = "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684";
export const RPC_URL_97 = `https://data-seed-prebsc-1-s2.binance.org:8545/`;

export const ABI = {
  ERC20: ["function balanceOf(address account) external view returns (uint256)"],
  QUARRY: ["function mint() public"], GEM: [
    "function engraving(uint256) public view returns (string)",
    "function engraver(uint256) public view returns (address)",
    "function getAttributes(uint256 _tokenId) public view returns (uint16[2][] memory geometrical,uint8 category,uint8 color,uint8 clarity,uint8 luster,uint8 hardness,uint8 origin,address render)",
  ],
};