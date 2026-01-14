'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Gift, Loader2, Coins, Zap } from 'lucide-react';
import { getDailyMissions, claimMissionReward, DailyMission } from '@/app/actions/missions';
import { useToast } from '@/hooks/use-toast';

export function DailyMissions() {
    const [missions, setMissions] = useState<DailyMission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        loadMissions();
    }, []);

    const loadMissions = async () => {
        try {
            const result = await getDailyMissions();
            if (result.success && result.data) {
                setMissions(result.data);
            }
        } catch (error) {
            console.error("Failed to load missions", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaim = async (mission: DailyMission) => {
        setClaimingId(mission.id);
        try {
            const result = await claimMissionReward(mission.id);
            if (result.success) {
                toast({
                    title: "Reward Claimed!",
                    description: `Earned ${result.rewards?.coins} Coins and ${result.rewards?.xp} XP`,
                });
                setMissions(prev => prev.map(m =>
                    m.id === mission.id ? { ...m, is_claimed: true } : m
                ));
            } else {
                toast({
                    title: "Claim Failed",
                    description: result.error,
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive"
            });
        } finally {
            setClaimingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="relative bg-white border-2 border-gray-900 p-6">
                <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10" />
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-50 w-1/3" />
                    <div className="h-16 bg-gray-50" />
                    <div className="h-16 bg-gray-50" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-white border-2 border-gray-900 p-6">
            <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-amber-400 -z-10" />

            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-400 text-gray-900 flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-xl uppercase text-gray-900">Daily Missions</h3>
            </div>

            <div className="space-y-4">
                {missions.map((mission) => {
                    const isComplete = mission.current_progress >= mission.target_count;
                    const progressPercent = Math.min(100, (mission.current_progress / mission.target_count) * 100);

                    return (
                        <div
                            key={mission.id}
                            className={`p-4 border-2 transition-all ${
                                mission.is_claimed
                                    ? 'bg-gray-50/50 border-gray-900/20 opacity-60'
                                    : isComplete
                                        ? 'bg-emerald-500/5 border-emerald-500'
                                        : 'bg-gray-50 border-gray-900/30'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className={`font-bold text-gray-900 ${mission.is_claimed ? 'line-through opacity-50' : ''}`}>
                                        {mission.description}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-400 px-2 py-0.5 text-xs font-bold">
                                            <Coins className="w-3 h-3" />
                                            +{mission.reward_coins}
                                        </span>
                                        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-500 px-2 py-0.5 text-xs font-bold">
                                            <Zap className="w-3 h-3" />
                                            +{mission.reward_xp} XP
                                        </span>
                                    </div>
                                </div>

                                {mission.is_claimed ? (
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                ) : isComplete ? (
                                    <button
                                        className="px-4 py-2 bg-orange-500 text-white font-bold text-xs uppercase hover:bg-orange-600 transition-colors animate-pulse disabled:opacity-50"
                                        onClick={() => handleClaim(mission)}
                                        disabled={!!claimingId}
                                    >
                                        {claimingId === mission.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Claim'
                                        )}
                                    </button>
                                ) : (
                                    <span className="text-sm font-heading text-gray-500">
                                        {mission.current_progress}/{mission.target_count}
                                    </span>
                                )}
                            </div>

                            {!mission.is_claimed && (
                                <div className="h-2 bg-gray-50 border border-gray-900/20">
                                    <div
                                        className={`h-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-orange-500'}`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
