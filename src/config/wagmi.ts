// ============================================================
// YieldPulse — Wagmi Configuration (Base chain only)
// ============================================================

import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "YieldPulse",
      preference: "smartWalletOnly",
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [base.id]: http(),
  },
});
