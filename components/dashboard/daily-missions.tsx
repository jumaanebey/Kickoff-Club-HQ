'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Gift, Loader2 } from 'lucide-react';
import { getDailyMissions, claimMissionReward, DailyMission } from '@/app/actions/missions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/shared/utils';

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
                    title: "Reward Claimed! 🎉",
                    description: `Earned ${result.rewards?.coins} Coins and ${result.rewards?.xp} XP`,
                });
                // Update local state
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
        return <div className="animate-pulse h-48 bg-slate-900/50 rounded-xl" />;
    }

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Gift className="w-5 h-5 text-orange-500" />
                    Daily Missions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {missions.map((mission) => {
                    const isComplete = mission.current_progress >= mission.target_count;
                    const progressPercent = Math.min(100, (mission.current_progress / mission.target_count) * 100);

                    return (
                        <div
                            key={mission.id}
                            className={cn(
                                "p-3 rounded-lg border transition-all",
                                mission.is_claimed
                                    ? "bg-slate-950/50 border-slate-800 opacity-60"
                                    : isComplete
                                        ? "bg-gradient-to-r from-slate-900 to-slate-800 border-orange-500/50 shadow-[0_0_15px_-5px_rgba(249,115,22,0.3)]"
                                        : "bg-slate-950 border-slate-800"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className={cn("font-medium text-sm", mission.is_claimed && "line-through text-slate-500")}>
                                        {mission.description}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-slate-800 text-yellow-500 border-slate-700">
                                            +{mission.reward_coins} Coins
                                        </Badge>
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-slate-800 text-blue-400 border-slate-700">
                                            +{mission.reward_xp} XP
                                        </Badge>
                                    </div>
                                </div>

                                {mission.is_claimed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500/50" />
                                ) : isComplete ? (
                                    <Button
                                        size="sm"
                                        className="h-7 text-xs bg-orange-500 hover:bg-orange-600 text-white animate-pulse"
                                        onClick={() => handleClaim(mission)}
                                        disabled={!!claimingId}
                                    >
                                        {claimingId === mission.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Claim"}
                                    </Button>
                                ) : (
                                    <span className="text-xs font-mono text-slate-500">
                                        {mission.current_progress}/{mission.target_count}
                                    </span>
                                )}
                            </div>

                            {!mission.is_claimed && (
                                <Progress value={progressPercent} className="h-1.5 bg-slate-800" indicatorClassName={isComplete ? "bg-green-500" : "bg-orange-500"} />
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
