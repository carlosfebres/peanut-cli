import "dotenv/config";
import { ethers } from "ethers";

import { generateKeysFromString, signClaimTx } from "./utils/password";
import {
  getPeanutContractAddr,
  getRpcUrl,
  getTxExplorer,
  getWallet,
} from "./utils/blockchain";

import ERC20_ABI from "./abis/ERC20.json";
import ERC721_ABI from "./abis/ERC721.json";
import PeanutV3_ABI from "./abis/PeanutV3.json";

interface ClaimDepositOpts {
  recipient: string;
  network: string;
  index: string;
  password: string;
}

export async function claimDeposit(opts: ClaimDepositOpts) {
  const { index, password, recipient, network } = opts;

  const provider = new ethers.JsonRpcProvider(getRpcUrl(network));
  const wallet = getWallet().connect(provider);
  const peanutAddr = getPeanutContractAddr(network);

  const peanutContract = new ethers.Contract(peanutAddr, PeanutV3_ABI, wallet);

  const { addressHashEIP191, signature } = await signClaimTx(
    password,
    recipient,
  );

  console.log(`Claiming tokens from Peanut contract...`);

  const tx = await peanutContract.withdrawDeposit(
    index,
    recipient,
    addressHashEIP191,
    signature,
  );
  console.log("Sent, waiting for tx confirmation...");
  const receipt: ethers.TransactionReceipt = await tx.wait();

  console.log("======= Claimed Successful =======");
  console.log("= Index: ", index.toString());
  console.log("= Tx Hash: ", getTxExplorer(network, receipt.hash));
}
