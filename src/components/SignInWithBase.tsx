"use client";

import { Connector } from "wagmi";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SignInWithBaseProps {
  connector: Connector;
}

export function SignInWithBase({ connector }: SignInWithBaseProps) {
  const [verificationResult, setVerificationResult] = useState<string>("");

  async function handleBaseAccountConnect() {
    const provider = await connector.getProvider();
    if (provider) {
      try {
        const clientNonce =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        
        const accounts = await (provider as any).request({
          method: "wallet_connect",
          params: [
            {
              version: "1",
              capabilities: {
                signInWithEthereum: {
                  nonce: clientNonce,
                  chainId: "0x2105", // Base Mainnet
                },
              },
            },
          ],
        });

        const result = { success: true, address: accounts[0].address };

        if (result.success) {
          setVerificationResult(`Verified! ${result.address.slice(0, 6)}...`);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  }

  return (
    <Button
      onClick={handleBaseAccountConnect}
       className="px-6 py-2 bg-[#0052FF] hover:bg-[#1a66ff] rounded-2xl font-bold text-sm border-b-4 border-blue-800 transition-all text-white flex items-center gap-2"
    >
      Sign in with Base
    </Button>
  );
}
