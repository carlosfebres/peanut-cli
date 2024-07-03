import "dotenv/config";
import { ethers } from "ethers";

import { generateKeysFromString, getRandomString } from "./utils/password";
import {
  getPeanutContractAddr,
  getRpcUrl,
  getTxExplorer,
  getWallet,
} from "./utils/blockchain";

import ERC20_ABI from "./abis/ERC20.json";
import ERC721_ABI from "./abis/ERC721.json";
import PeanutV3_ABI from "./abis/PeanutV3.json";

interface CreateLinkOpts {
  tokenAddress: string;
  amountOrTokenId: string;
  network: string;
  contractType: string;
  password?: string;
}

export async function createLink(opts: CreateLinkOpts) {
  const {
    network,
    contractType,
    amountOrTokenId,
    tokenAddress,
    password = getRandomString(),
  } = opts;

  const provider = new ethers.JsonRpcProvider(getRpcUrl(network));
  const wallet = getWallet().connect(provider);
  const peanutAddr = getPeanutContractAddr(network);

  const peanutContract = new ethers.Contract(peanutAddr, PeanutV3_ABI, wallet);

  const { amount, tokenId } =
    contractType === "1"
      ? {
          amount: amountOrTokenId,
          tokenId: "0",
        }
      : {
          amount: "1",
          tokenId: amountOrTokenId,
        };

  if (contractType === "1") {
    try {
      console.log(`Approving ${amount} tokens...`);
      const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
      const tx = await erc20.approve(peanutAddr, amount);
      await tx.wait();
    } catch (err) {
      console.log("Failed to approve tokens");
      return;
    }
  } else {
    try {
      console.log(`Approving NFT #${tokenId}...`);
      const erc721 = new ethers.Contract(tokenAddress, ERC721_ABI, wallet);
      const tx = await erc721.approve(peanutAddr, tokenId);
      await tx.wait();
    } catch (err) {
      console.log("Failed to approve NFT");
      return;
    }
  }

  const signingWallet = generateKeysFromString(password);

  console.log(
    `Depositing tokens to Peanut contract... (password: ${password})`,
  );

  const tx = await peanutContract.makeDeposit(
    tokenAddress,
    contractType,
    amount,
    tokenId,
    signingWallet.address,
  );
  console.log("Sent, waiting for tx confirmation...");
  const receipt: ethers.TransactionReceipt = await tx.wait();

  const [DepositEventTopic0] = await peanutContract.filters
    .DepositEvent()
    .getTopicFilter();

  const depositEvent = receipt.logs.find(
    (log) => log.topics[0] === DepositEventTopic0,
  );

  if (!depositEvent) throw new Error("Deposit event not found");

  const { _index: index } = peanutContract.interface.decodeEventLog(
    "DepositEvent",
    depositEvent.data,
    depositEvent.topics,
  );

  console.log("======= Deposit =======");
  console.log("= Index: ", index.toString());
  console.log("= Password: ", password);
  console.log("= Tx Hash: ", getTxExplorer(network, receipt.hash));
}
