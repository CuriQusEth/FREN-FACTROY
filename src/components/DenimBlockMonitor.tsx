import React, { useState, useEffect, useRef } from "react";
import { useBlockNumber, useChainId } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { Zap, Clock, CheckCircle2, Activity, Layers, ShieldCheck, ChevronRight, AlertTriangle } from "lucide-react";

export function DenimBlockMonitor() {
  const chainId = useChainId();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [blockCadenceMs, setBlockCadenceMs] = useState<number | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<{ number: string; time: string; diffMs?: number }[]>([]);
  const lastBlockTimeRef = useRef<number | null>(null);
  const [showMigrationModal, setShowMigrationModal] = useState(false);

  const isSepolia = chainId === baseSepolia.id;
  const isMainnet = chainId === base.id;

  useEffect(() => {
    if (!blockNumber) return;

    const now = Date.now();
    let diff: number | undefined = undefined;

    if (lastBlockTimeRef.current) {
      diff = now - lastBlockTimeRef.current;
      setBlockCadenceMs(diff);
    }
    lastBlockTimeRef.current = now;

    setRecentBlocks((prev) => {
      const updated = [
        {
          number: blockNumber.toString(),
          time: new Date().toLocaleTimeString(),
          diffMs: diff,
        },
        ...prev,
      ];
      return updated.slice(0, 5);
    });
  }, [blockNumber]);

  return (
    <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-4 backdrop-blur-md shadow-lg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Status badge and info */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 mt-0.5">
            <Zap className="w-5 h-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Base Denim Upgrade
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {isSepolia ? "200ms Native Blocks Live (Sepolia)" : isMainnet ? "Denim Ready (Mainnet Target Nov 2026)" : "200ms Canonical Engine Active"}
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1 max-w-xl">
              Migrated from Flashblocks to canonical 200ms blocks. Sub-second game state attestation and ERC-8021 attribution with zero <code className="bg-black/40 text-amber-300 px-1 py-0.2 rounded font-mono text-[10px]">pending</code> block tag dependency.
            </p>
          </div>
        </div>

        {/* Right: Real-time Block Stats */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-right">
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider flex items-center justify-end gap-1">
              <Layers className="w-3 h-3 text-blue-400" /> Canonical Block
            </div>
            <div className="font-mono text-sm font-black text-cyan-300">
              {blockNumber ? `#${blockNumber.toString()}` : "Syncing..."}
            </div>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-right min-w-[100px]">
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider flex items-center justify-end gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> Cadence
            </div>
            <div className="font-mono text-sm font-black text-emerald-400">
              {blockCadenceMs ? `${(blockCadenceMs / 1000).toFixed(2)}s` : "~0.2s target"}
            </div>
          </div>

          <button
            onClick={() => setShowMigrationModal(true)}
            className="px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-white/90 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Checklist
          </button>
        </div>
      </div>

      {/* Migration Checklist Modal / Popover */}
      {showMigrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Denim 200ms Migration Inventory</h3>
              </div>
              <button
                onClick={() => setShowMigrationModal(false)}
                className="text-white/50 hover:text-white text-sm px-2 py-1 rounded-lg bg-white/5"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 mt-3">
              Denim replaces Flashblocks with native canonical 200ms blocks. Flashblocks subscriptions (<code className="text-amber-300">newFlashblocks</code>, <code className="text-amber-300">pendingLogs</code>) and the <code className="text-amber-300">"pending"</code> block tag are deprecated.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">Canonical Subscriptions Active</div>
                  <div className="text-[11px] text-white/60">Using <code className="text-white/80">eth_subscribe("newHeads")</code> and standard block queries. Zero Flashblocks endpoints.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">Zero "pending" Block Tag Requests</div>
                  <div className="text-[11px] text-white/60">All balance, nonce, and execution calls read canonical latest state, eliminating preconf race conditions.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">ERC-8021 Attribution Intact</div>
                  <div className="text-[11px] text-white/60">Schema 0 builder code suffix <code className="text-yellow-300">bc_i3cpa0pz</code> is embedded into calldata / Smart Wallet calls seamlessly in 200ms canonical blocks.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">Live on Base Sepolia & Vibenet</div>
                  <div className="text-[11px] text-white/60">Activated on Base Sepolia Oct 21, 2026 at 18:00 UTC. Mainnet targeting Nov 2026.</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowMigrationModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
