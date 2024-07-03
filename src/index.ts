import { program } from "commander";
import { createLink } from "./createLinks";
import { claimDeposit } from "./claimDeposit";

program
  .version("1.0.0")
  .name("Peanut Links")
  .description("Tool to generate and claim Peanut links");

program
  .command("create")
  .description("Create a Peanut link")
  .argument("<tokenAddress>", "token address")
  .argument("<amountOrTokenId>", "amount/tokenId")
  .option("--contractType", "Contract type. 1=ERC20 2=ERC721", "1")
  .option("--network", "Network. opts: optimism, base", "optimism")
  .option("--password", "Password")
  .action(
    (
      tokenAddress: string,
      amountOrTokenId: string,
      options: {
        contractType: "1" | "2";
        network: "optimism" | "base";
        password?: string;
      },
    ) => createLink({ tokenAddress, amountOrTokenId, ...options }),
  );

program
  .command("claim")
  .description("Claim a Peanut link")
  .argument("<index>", "Deposit index")
  .argument("<recipient>", "Recipient address")
  .argument("<password>", "Password")
  .option("--network", "Network. opts: optimism, base", "optimism")
  .action(
    (
      index: string,
      recipient: string,
      password: string,
      options: {
        network: "optimism" | "base";
      },
    ) => claimDeposit({ recipient, password, index, ...options }),
  );

program.parse();
