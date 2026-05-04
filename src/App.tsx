import React, { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { useGame, GameProvider, Rarity, Fren } from "@/lib/GameContext";
import { useAccount } from "wagmi";
import { useERC8021Transaction } from "@/lib/erc8021/hooks/useERC8021Transaction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";
import { encodeFunctionData } from "viem";
import { BUILDER_CODE } from "@/config";
import { FREN_FACTORY_ABI, FREN_FACTORY_ADDRESS } from "@/contracts";

// Utilities
const generateId = () => Math.random().toString(36).substr(2, 9);
const RARITY_COLORS: Record<Rarity, string> = {
  Common: "bg-gray-500 text-white",
  Rare: "bg-cyan-500 text-white",
  Epic: "bg-pink-500 text-white",
  Legendary: "bg-yellow-500 text-black",
  Mythic: "bg-red-500 text-white animate-pulse",
};
const RARITY_HIERARCHY: Rarity[] = [
  "Common",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
];

function generateFren(gooInvested: number): Fren {
  const roll = Math.random();
  let rarity: Rarity = "Common";

  // Example probability scaling based on Goo amount
  const bonus = Math.min(gooInvested / 10000, 0.5); // Max 50% bonus from goo

  if (roll + bonus > 0.98) rarity = "Mythic";
  else if (roll + bonus > 0.9) rarity = "Legendary";
  else if (roll + bonus > 0.7) rarity = "Epic";
  else if (roll + bonus > 0.4) rarity = "Rare";

  return {
    id: generateId(),
    name: `${rarity} Fren #${Math.floor(Math.random() * 1000)}`,
    rarity,
    productionRate: (RARITY_HIERARCHY.indexOf(rarity) + 1) * 10,
  };
}

function ClickerArea() {
  const { state, dispatch } = useGame();
  const { isConnected, address } = useAccount();
  const { sendTransaction } = useERC8021Transaction({
    code: BUILDER_CODE,
    schema: 1,
  });
  const [clickScale, setClickScale] = useState(1);

  const handleClick = () => {
    dispatch({ type: "CLICK_PRODUCE" });
    setClickScale((prev) => (prev === 1 ? 0.95 : 1));
    setTimeout(() => setClickScale(1), 100);

    // Mock an on-chain transaction interaction
    if (isConnected && Math.random() > 0.95) {
      // 5% chance to prompt on-chain save
      toast("Save Progress On-Chain?", {
        action: {
          label: "Save",
          onClick: () => {
            const data = encodeFunctionData({
              abi: FREN_FACTORY_ABI,
              functionName: "produceGoo",
            });
            // Construct the final data with ERC-8021 builder code
            sendTransaction(
              {
                to: FREN_FACTORY_ADDRESS as `0x${string}`,
                data: data,
              },
              {
                onSuccess: () =>
                  toast.success("Progress saved securely on Base!"),
                onError: (e) => toast.error(`Failed: ${e.message}`),
              },
            );
          },
        },
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] p-5 relative overflow-hidden group">
      <div>
        <h3 className="text-2xl font-black text-center tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent uppercase italic">
          Goo Generator
        </h3>
        <p className="text-center font-medium text-white/50 text-xs mt-1">
          Click the giant Goo drop to produce resources.
        </p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative py-6">
        <motion.div
          animate={{ scale: clickScale }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <button
            onClick={handleClick}
            className="w-48 h-48 rounded-[40%] bg-gradient-to-br from-green-300 to-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)] border-4 border-white/20 flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-4 ring-emerald-300"
          >
            <div className="text-5xl">💧</div>
          </button>
        </motion.div>

        <div className="mt-12 w-full max-w-xs space-y-2 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">
            Current Goo
          </p>
          <p className="text-4xl font-black font-mono text-cyan-400">
            {Math.floor(state.goo).toLocaleString()}
          </p>
          <p className="text-[10px] text-green-400 font-bold">
            +{state.frens.reduce((acc, f) => acc + f.productionRate, 0)} per sec
          </p>
        </div>
      </div>
      {isConnected && (
        <div className="mt-4 flex justify-center pb-2 z-10 relative">
          <button
            onClick={() => {
              if (address) {
                sendTransaction(
                  {
                    to: address,
                    data: "0x",
                  },
                  {
                    onSuccess: () =>
                      toast.success("GM! Transaction attributed via ERC-8021!"),
                    onError: (e) => toast.error(`Failed: ${e.message}`),
                  },
                );
              }
            }}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 rounded-2xl font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all text-white border-b-4 border-purple-800 active:border-b-0 active:translate-y-1"
          >
            Say GM On-Chain! ☀️
          </button>
        </div>
      )}
    </div>
  );
}

function FactoryArea() {
  const { state, dispatch } = useGame();
  const hatchCost = 100;

  const handleHatch = () => {
    if (state.goo >= hatchCost) {
      dispatch({
        type: "HATCH_FREN",
        payload: { cost: hatchCost, newFren: generateFren(hatchCost) },
      });
      toast.success("Hatched a new Fren! 🎉");
    } else {
      toast.error("Not enough Goo!");
    }
  };

  const handleMerge = (fren: Fren) => {
    // Find another fren of same rarity
    const partner = state.frens.find(
      (f) => f.id !== fren.id && f.rarity === fren.rarity,
    );
    if (!partner) {
      toast.error(`Need another ${fren.rarity} Fren to merge!`);
      return;
    }

    const currentIndex = RARITY_HIERARCHY.indexOf(fren.rarity);
    if (currentIndex === RARITY_HIERARCHY.length - 1) {
      toast.error("Already max rarity!");
      return;
    }

    const nextRarity = RARITY_HIERARCHY[currentIndex + 1];
    const newFren: Fren = {
      id: generateId(),
      name: `${nextRarity} Fren #${Math.floor(Math.random() * 1000)}`,
      rarity: nextRarity,
      productionRate: (currentIndex + 2) * 10,
    };

    dispatch({
      type: "MERGE_FRENS",
      payload: { id1: fren.id, id2: partner.id, newFren },
    });
    toast("Frens merged successfully! ✨", {
      icon: "🧬",
    });
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[48px] relative overflow-hidden group p-6">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="relative z-10 flex items-center justify-between mb-6">
        <span className="font-bold text-xl tracking-tight text-white uppercase italic">
          Fren Factory Line
        </span>
        <button
          onClick={handleHatch}
          disabled={state.goo < hatchCost}
          className="px-6 py-2 bg-[#0052FF] hover:bg-[#1a66ff] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-sm border-b-4 border-blue-800 transition-all text-white"
        >
          🥚 Hatch Fren ({hatchCost} Goo)
        </button>
      </div>

      <div className="flex-1 relative z-10">
        <ScrollArea className="h-[400px] w-full pb-4">
          {state.frens.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/40 p-8 border border-dashed border-white/20 rounded-3xl min-h-[300px]">
              <span className="text-4xl mb-4">🏭</span>
              <p className="font-medium text-[10px] uppercase tracking-widest text-center">
                Your factory is empty.
                <br />
                Produce Goo to hatch your first Fren!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
              <AnimatePresence>
                {state.frens.map((fren) => (
                  <motion.div
                    key={fren.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    layout
                  >
                    <div className="bg-white/10 rounded-3xl border border-dashed border-white/20 flex flex-col items-center justify-center p-4 relative group hover:bg-white/20 transition-all min-h-[160px]">
                      <span
                        className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full ${RARITY_COLORS[fren.rarity]}`}
                      >
                        {fren.rarity.toUpperCase()}
                      </span>
                      <div
                        className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center text-3xl shrink-0 border border-white/10 bg-white/5`}
                      >
                        {fren.rarity === "Mythic"
                          ? "🐉"
                          : fren.rarity === "Legendary"
                            ? "🦄"
                            : fren.rarity === "Epic"
                              ? "🦊"
                              : fren.rarity === "Rare"
                                ? "🐶"
                                : "🐹"}
                      </div>
                      <p className="text-center font-bold text-[10px] tracking-tight line-clamp-1">
                        {fren.name}
                      </p>
                      <p className="text-center text-[10px] text-white/40 font-mono mt-1">
                        +{fren.productionRate} /s
                      </p>

                      <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="w-full text-[10px] h-8 font-bold border border-white/20 bg-white/10 hover:bg-white/30 rounded-xl"
                          onClick={() => handleMerge(fren)}
                        >
                          Merge 🧬
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

import { useSignMessage } from "wagmi";
import { generateSiweNonce, createSiweMessage } from "viem/siwe";

function TokenStats() {
  const { state } = useGame();
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);

  const handleSignHighScore = async () => {
    if (!isConnected || !address || !chainId) {
      toast.error("Connect wallet first!");
      return;
    }
    setIsSigning(true);
    try {
      const nonce = generateSiweNonce();
      const message = createSiweMessage({
        address,
        chainId,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: "1",
        statement: `I attest my high score is ${Math.floor(state.goo)} Goo in Batch Wizard!`,
      });
      const signature = await signMessageAsync({ message });
      toast.success(`High score signed! ${signature.slice(0, 10)}...`);
    } catch (e: any) {
      toast.error(`Sign failed: ${e.message}`);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] p-5 flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">
          Treasury (High Score Setup)
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl">🪙</span>
          <p className="text-2xl font-black font-mono text-green-400">
            {state.frenTokens.toFixed(2)}
          </p>
          <span className="text-xl font-bold text-white/80">$FREN</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSignHighScore}
          disabled={isSigning || !isConnected}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-2xl font-bold text-sm border-b-4 border-red-900 transition-all text-white disabled:opacity-50"
        >
          {isSigning ? "Signing..." : "Submit SIWE High Score 🏅"}
        </button>
        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-2xl font-bold text-sm border-b-4 border-blue-900 transition-all text-white">
          Claim Passive Yield
        </button>
      </div>
    </div>
  );
}

function MainDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
            <span className="text-2xl">🧸</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3">
              FREN FACTORY
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold opacity-80 mt-1">
              Base Ecosystem • ERC-8021 Active
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <WalletConnect />
        </div>
      </header>

      <TokenStats />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto min-h-[500px]">
        <div className="lg:col-span-4 h-full">
          <ClickerArea />
        </div>
        <div className="lg:col-span-8 h-full">
          <FactoryArea />
        </div>
      </div>

      <div className="mt-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
          Prompt Book for Art Assets
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl font-mono text-[10px] text-white/70">
            <span className="text-white/40 block mb-2">
              // Midjourney / Grok - Mascot / UI Elements
            </span>
            "A highly polished 3D icon of an adorable blob character in
            isometric view, holding a wrench, bright pastel colors, neon
            accents, Base blockchain blue ecosystem vibe, white background,
            suitable for a playful casual crypto clicker game UI, ultra high
            definition, octane render --v 6.0"
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl font-mono text-[10px] text-white/70">
            <span className="text-white/40 block mb-2">
              // Midjourney / Grok - Fren Evolution (Legendary)
            </span>
            "Cute chibi cyberpunk pet mascot, glowing neon legendary aura,
            holographic tech wear, adorable big eyes, standing heroically,
            bright vivid colors on a clean dark background, 2d vector art style,
            clean lines, game asset ready, dynamic pose --v 6.0"
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl font-mono text-[10px] text-white/70">
            <span className="text-white/40 block mb-2">
              // Midjourney / Grok - Resource Icon (Goo)
            </span>
            "A shiny, translucent drop of neon green goo resource item for a
            mobile game, glowing core, 3d glossy render, bright and saturated
            colors, isolated on white background, hyperdetailed, magical --v
            6.0"
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-[#0a0a1f] relative font-sans text-white overflow-x-hidden selection:bg-blue-500/30">
        {/* Mesh Background */}
        <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0052FF] blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#FF00E5] blur-[140px]"></div>
          <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-[#00F0FF] blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col p-6 min-h-screen">
          <MainDashboard />
          <Toaster theme="dark" className="opacity-90" />
        </div>
      </div>
    </GameProvider>
  );
}
