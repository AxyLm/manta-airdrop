export interface BoxInfo {
  id: string;
  eth_address: string;
  dot_address?: string;
  unOpenedBox: number;
  unClaimedBox: number;
  unOpenedEthBox: number;
  unClaimedEthBox: number;
  unOpenedDotBox: number;
  unClaimedDotBox: number;
}
export interface Points {
  id: string;
  eth_address: string;
  dot_address?: any;
  dot_score: number;
  eth_score: number;
  total_score: number;
  checklist: Checklist;
}
export interface Checklist {
  zkSBT: boolean;
  MantaFest: boolean;
  MantaFestTreasureCruise: boolean;
  MantaTakeover: boolean;
  MantaAtlanticEarlySupporters: boolean;
  GiantSquidForCalamari: boolean;
  zkAppUsers: boolean;
  ChampionsWizards: boolean;
  Trusta: boolean;
  zkBAB: boolean;
  zkGalxe: boolean;
  zkArbAirdrop: boolean;
  zkLineaNFT: boolean;
  zkOP: boolean;
}
