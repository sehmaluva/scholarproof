import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import type { NetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import type { ProofProvider, PrivateStateProvider, PublicDataProvider } from "@midnight-ntwrk/midnight-js-types";

import type { ScholarProofPrivateState } from "../contract/privateState.js";
import { ScholarProofZkConfigProvider } from "./zk-config.js";

export interface MidnightConfig {
  networkId: NetworkId;
  indexerUrl: string;
  proofServerUrl: string;
  nodeUrl?: string;
}

export const TESTNET_CONFIG: MidnightConfig = {
  networkId: "testnet" as NetworkId,
  indexerUrl: "https://indexer.testnet.midnight.network/graphql",
  proofServerUrl: "https://proof-server.testnet.midnight.network",
  nodeUrl: "https://rpc.testnet.midnight.network",
};

export const LOCAL_CONFIG: MidnightConfig = {
  networkId: "undeployed" as NetworkId,
  indexerUrl: "http://localhost:8080/graphql",
  proofServerUrl: process.env.MIDNIGHT_PROOF_SERVER_URL || "http://localhost:6300",
  nodeUrl: "http://localhost:9944",
};

export interface MidnightProviders {
  config: MidnightConfig;
  publicDataProvider: PublicDataProvider;
  proofProvider: ProofProvider;
  privateStateProvider: PrivateStateProvider<string, ScholarProofPrivateState>;
  zkConfigProvider: ScholarProofZkConfigProvider;
}

const DEV_STORAGE_PASSWORD = "ScholarProof-Demo-Key-2026!";

export function createProviders(config: MidnightConfig = LOCAL_CONFIG): MidnightProviders {
  setNetworkId(config.networkId);

  const zkConfigProvider = new ScholarProofZkConfigProvider();

  const publicDataProvider = indexerPublicDataProvider(
    config.indexerUrl,
    config.indexerUrl.replace("/graphql", "/graphql/ws").replace("http", "ws")
  );

  const proofProvider = httpClientProofProvider(config.proofServerUrl, zkConfigProvider);

  const privateStateProvider = levelPrivateStateProvider({
    midnightDbName: "scholarproof-midnight",
    privateStateStoreName: "private-states",
    signingKeyStoreName: "signing-keys",
    accountId: "scholarproof-demo",
    privateStoragePasswordProvider: async () => DEV_STORAGE_PASSWORD,
  });

  return {
    config,
    publicDataProvider,
    proofProvider,
    privateStateProvider,
    zkConfigProvider,
  };
}

export async function checkProofServerHealth(proofServerUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${proofServerUrl}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    try {
      const res = await fetch(proofServerUrl, { signal: AbortSignal.timeout(2000) });
      return res.ok || res.status < 500;
    } catch {
      return false;
    }
  }
}
