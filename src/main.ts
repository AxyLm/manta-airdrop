import { Wallet } from "ethers";
import { MantaAirdrop } from "./scripts/manta-airdrop";

(async () => {
  if (!process.env.WALLET_PRIVATEKEY) {
    console.error("%c !!! WALLET_PRIVATEKEY is not set, please create .env file and set it ", "color: red");
    process.exit(1);
  }

  const wallet = new Wallet(process.env.WALLET_PRIVATEKEY);
  const manta = new MantaAirdrop(wallet);

  await manta.claim();
})();
