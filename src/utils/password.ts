import { ethers } from "ethers";

export function generateKeysFromString(string: string) {
  const privateKey = ethers.keccak256(ethers.toUtf8Bytes(string));
  const wallet = new ethers.Wallet(privateKey);

  return {
    address: wallet.address,
    privateKey: privateKey,
  };
}

export async function signClaimTx(password: string, recipient: string) {
  const keys = generateKeysFromString(password);

  const addressHash = ethers.getBytes(
    ethers.solidityPackedKeccak256(["address"], [recipient]),
  );
  const addressHashEIP191 = ethers.hashMessage(addressHash);

  const signer = new ethers.Wallet(keys.privateKey);
  const signature = await signer.signMessage(addressHash);

  return { signature, addressHashEIP191 };
}

export function getRandomString(length = 32) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result_str = "";
  for (let i = 0; i < length; i++) {
    result_str += chars[Math.floor(Math.random() * chars.length)];
  }
  return result_str;
}
