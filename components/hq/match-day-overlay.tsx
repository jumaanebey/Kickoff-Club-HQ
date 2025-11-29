'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, XCircle, Timer, Coins, Star } from 'lucide-react';
import { cn } from '@/shared/utils';

interface MatchLog {
    quarter: number;
    event: string;
    scoreChange: number;
    isUser: boolean;
}

interface MatchResult {
    won: boolean;
    userScore: number;
    opponentScore: number;
    rewards: { coins: number; xp: number };
    log: MatchLog[];
    opponentName: string;
}

interface MatchDayOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    matchResult: MatchResult | null;
}

export function MatchDayOverlay({ isOpen, onClose, matchResult }: MatchDayOverlayProps) {
    const [visibleLogIndex, setVisibleLogIndex] = useState(0);
    const [currentScore, setCurrentScore] = useState({ user: 0, opponent: 0 });
    const [gameStatus, setGameStatus] = useState<'warmup' | 'playing' | 'finished'>('warmup');

    useEffect(() => {
        if (isOpen && matchResult) {
            setGameStatus('warmup');
            setVisibleLogIndex(0);
            setCurrentScore({ user: 0, opponent: 0 });

            // Start simulation playback
            const warmupTimer = setTimeout(() => {
                setGameStatus('playing');
            }, 1000);

            return () => clearTimeout(warmupTimer);
        }
    }, [isOpen, matchResult]);

    useEffect(() => {
        if (gameStatus === 'playing' && matchResult) {
            if (visibleLogIndex < matchResult.log.length) {
                const timer = setTimeout(() => {
                    const event = matchResult.log[visibleLogIndex];

                    // Update score
                    if (event.scoreChange > 0) {
                        setCurrentScore(prev => ({
                            user: event.isUser ? prev.user + event.scoreChange : prev.user,
                            opponent: !event.isUser ? prev.opponent + event.scoreChange : prev.opponent
                        }));
                    }

                    setVisibleLogIndex(prev => prev + 1);
                }, 800); // Speed of playback

                return () => clearTimeout(timer);
            } else {
                setGameStatus('finished');
            }
        }
    }, [gameStatus, visibleLogIndex, matchResult]);

    if (!matchResult) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && gameStatus === 'finished' && onClose()}>
            <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-2xl w-full h-[80vh] flex flex-col p-0 overflow-hidden">
                {/* Scoreboard Header */}
                <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('/kickoff-club-assets/buildings/stadium/building-stadium-level-5@2x.png')] bg-cover bg-center" />

                    {/* Home Team */}
                    <div className="z-10 text-center w-1/3">
                        <div className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Home</div>
                        <div className="text-4xl font-black text-orange-500">{currentScore.user}</div>
                        <div className="text-xs text-slate-500 mt-1">Coach You</div>
                    </div>

                    {/* Clock / Status */}
                    <div className="z-10 flex flex-col items-center justify-center w-1/3">
                        <div className="bg-black/50 px-4 py-2 rounded-lg border border-slate-800 backdrop-blur-sm">
                            {gameStatus === 'warmup' && <span className="text-yellow-500 font-mono animate-pulse">WARM UP</span>}
                            {gameStatus === 'playing' && (
                                <div className="flex items-center gap-2 text-green-500 font-mono">
                                    <Timer className="w-4 h-4 animate-spin" />
                                    <span>Q{matchResult.log[Math.min(visibleLogIndex, matchResult.log.length - 1)]?.quarter || 1}</span>
                                </div>
                            )}
                            {gameStatus === 'finished' && <span className="text-white font-mono font-bold">FINAL</span>}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="z-10 text-center w-1/3">
                        <div className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Away</div>
                        <div className="text-4xl font-black text-white">{currentScore.opponent}</div>
                        <div className="text-xs text-slate-500 mt-1">{matchResult.opponentName}</div>
                    </div>
                </div>

                {/* Play-by-Play Log */}
                <ScrollArea className="flex-1 p-6 bg-slate-950/50">
                    <div className="space-y-4">
                        {matchResult.log.slice(0, visibleLogIndex).map((log, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "p-3 rounded-lg border animate-in slide-in-from-bottom-2 fade-in duration-300",
                                    log.isUser
                                        ? "bg-orange-950/20 border-orange-900/50 ml-auto max-w-[80%]"
                                        : "bg-slate-900/50 border-slate-800 mr-auto max-w-[80%]"
                                )}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className={cn("text-sm", log.isUser ? "text-orange-200" : "text-slate-300")}>
                                        {log.event}
                                    </span>
                                    {log.scoreChange > 0 && (
                                        <span className="text-xs font-bold bg-green-900/50 text-green-400 px-2 py-1 rounded">
                                            +{log.scoreChange}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[10px] text-slate-600 mt-1 uppercase">
                                    Quarter {log.quarter}
                                </div>
                            </div>
                        ))}
                        <div id="log-end" />
                    </div>
                </ScrollArea>

                {/* Footer / Result */}
                {gameStatus === 'finished' && (
                    <div className="p-6 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="flex flex-col items-center text-center">
                            {matchResult.won ? (
                                <>
                                    <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
                                    <h2 className="text-3xl font-black text-white mb-2">VICTORY!</h2>
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                                            <Coins className="w-4 h-4 text-yellow-500" />
                                            <span className="font-bold text-yellow-500">+{matchResult.rewards.coins}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                                            <Star className="w-4 h-4 text-blue-400" />
                                            <span className="font-bold text-blue-400">+{matchResult.rewards.xp} XP</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                                    <h2 className="text-3xl font-black text-white mb-2">DEFEAT</h2>
                                    <p className="text-slate-400 mb-6">Train your units and upgrade your stadium to improve your chances.</p>
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 opacity-50">
                                            <Coins className="w-4 h-4 text-yellow-500" />
                                            <span className="font-bold text-yellow-500">+{matchResult.rewards.coins}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 opacity-50">
                                            <Star className="w-4 h-4 text-blue-400" />
                                            <span className="font-bold text-blue-400">+{matchResult.rewards.xp} XP</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            <Button size="lg" className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold" onClick={onClose}>
                                Return to HQ
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
