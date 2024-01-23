/**
Copyright 2024 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
import { Wallet, ethers } from "ethers";
import axios from "axios";
import abi from "./abi";
import { BoxInfo, Points } from "./interface";

const providers = [
  {
    name: "Manta",
    url: "https://pacific-rpc.manta.network/http",
  },
  {
    name: "Manta",
    url: "https://1rpc.io/manta",
  },
];

export class MantaAirdrop {
  readonly name = "Manta Airdrop";

  private readonly contract: ethers.Contract;
  request = axios.create({
    baseURL: "https://np-api.newparadigm.manta.network/",
    headers: {
      Origin: "https://airdrop.manta.network",
    },
  });
  readonly provider = new ethers.providers.JsonRpcProvider(providers[Math.floor(Math.random() * providers.length)]);

  constructor(private readonly wallet: Wallet) {
    this.wallet.connect(this.provider);
    // https://manta-pacific.calderaexplorer.xyz/address/0xEe844BC4BB82c80d88068aFcd08dbACf72e27F74?tab=contract
    this.contract = new ethers.Contract("0xEe844BC4BB82c80d88068aFcd08dbACf72e27F74", abi, wallet.connect(this.provider));
  }

  async login1() {
    const sign = await this.wallet.signMessage(
      "Please sign to confirm whether to operate the Treasure Boxes and NFTs. Operations may include: Checking Eligibility, Opening Treasure Boxes, and Claiming Treasure NFTs."
    );
    return sign;
  }

  async login2() {
    const sign = await this.wallet.signMessage("Please sign to confirm whether to claim all Manta Tokens.");
    return sign;
  }

  async getClaimStatus() {
    const result = await this.request.get("/airdrop/claim", {
      params: {
        address: this.wallet.address,
      },
    });

    return result.data as {
      status: boolean;
      address: string;
    };
  }

  async getPoints(sig: string) {
    const result = await this.request.post<{ data: Points }>("/getPoints", { address: this.wallet.address, polkadot_address: "", eth_sig: sig, dot_sig: "" });
    return result.data;
  }

  async getBoxInfo() {
    const result = await this.request.post<{ data: BoxInfo }>("boxInfos", { address: this.wallet.address, polkadot_address: "" });
    return result.data;
  }

  async claimTokenFromPoints(opt: { eth_sig: string; dot_sig?: string; polkadot_address?: string }) {
    const result = await this.request.get("/claimTokenFromPoints", {
      params: opt,
    });

    return result.data as {
      status: boolean;
      data: {
        eth_address: string;
        dot_address?: string;
        eth_score: number;
        dot_score: number;
        eth: {
          receiver: string;
          nonce: string;
          tokenAmount: string;
          sig: {
            _type: string;
            networkV?: string;
            r: string;
            s: string;
            v: number;
          };
        };
      };
    };
  }

  async claim() {
    const sign1 = await this.login1();
    const sign = await this.login2();
    const points = await this.getPoints(sign1);

    if (points.data.total_score <= 0) {
      throw Error("total_score is 0");
    }
    const claimStatus = await this.getClaimStatus();
    const recoverSign = await this.claimTokenFromPoints({
      eth_sig: sign,
    });

    if (!claimStatus.status) {
      throw Error("claim end");
    }

    const params = [
      [this.wallet.address],
      [recoverSign.data.eth.nonce],
      [ethers.utils.parseEther(points.data.total_score.toString())],
      [recoverSign.data.eth.sig.v],
      [recoverSign.data.eth.sig.r],
      [recoverSign.data.eth.sig.s],
    ];

    console.log(params);
    const gas = await this.contract.estimateGas.batchClaimToken!(...params);
    console.log(gas.toString());
    const rawTx = await this.contract.batchClaimToken!(...params);
    console.log(rawTx);
    const tx = await rawTx.wait(1);
    console.log(tx.hash);
  }
}
