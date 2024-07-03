import { ethers } from "ethers";

export function getRpcUrl(network: string) {
  switch (network) {
    case "base":
      return "https://base-mainnet.g.alchemy.com/v2/k1F5fFw_2Zysxq1-86JYbO8h9vJnb2sf";
    default:
      return "https://optimism-mainnet.infura.io/v3/0667426f21dd41a59a540ce5275bae9a";
  }
}

export function getPeanutContractAddr(network: string) {
  switch (network) {
    case "base":
      return "0x22e993d9108dbde9f32553c3fd0a404acd2b7150";
    default:
      return "0xEA9E5A64ED3F892baD4b477709846b819013dEFC";
  }
}

export function getTxExplorer(network: string, txHash: string) {
  switch (network) {
    case "base":
      return `https://basescan.org/tx/${txHash}`;
    default:
      return `https://optimistic.etherscan.io/tx/${txHash}`;
  }
}

export function getWallet() {
  return new ethers.Wallet(process.env.PRIVATE_KEY!);
}
