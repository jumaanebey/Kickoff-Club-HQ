"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Zap, Trophy, ArrowUpCircle, Lock, Loader2 } from 'lucide-react';
import { upgradeBuilding, purchaseDecor } from '@/app/actions/hq';
import { useToast } from '@/hooks/use-toast';

// Mock Data for Fallback
const DEFAULT_HQ_STATE = {
    stadium_level: 1,
    film_room_level: 1,
    weight_room_level: 1,
    practice_field_level: 1,
    headquarters_level: 1,
    coins: 0,
    decor_slots: [] as string[]
};

const UPGRADES = {
    stadium: {
        name: "Stadium",
        levels: [
            { level: 1, cost: 0, benefit: "Base Capacity" },
            { level: 2, cost: 1000, benefit: "+10% Coin Earnings" },
            { level: 3, cost: 2500, benefit: "Unlock Tournament Mode" },
            { level: 4, cost: 5000, benefit: "+25% Coin Earnings" },
            { level: 5, cost: 10000, benefit: "Host Championship Games" }
        ],
        path: "stadium/building-stadium"
    },
    film_room: {
        name: "Film Room",
        levels: [
            { level: 1, cost: 0, benefit: "Basic Analysis" },
            { level: 2, cost: 800, benefit: "+5% XP from Courses" },
            { level: 3, cost: 2000, benefit: "+10% XP from Courses" },
            { level: 4, cost: 4000, benefit: "Unlock Advanced Stats" },
            { level: 5, cost: 8000, benefit: "Mastery Certification" }
        ],
        path: "film-room/building-film-room"
    },
    weight_room: {
        name: "Weight Room",
        levels: [
            { level: 1, cost: 0, benefit: "Basic Fitness" },
            { level: 2, cost: 600, benefit: "+10 Max Energy" },
            { level: 3, cost: 1500, benefit: "+20 Max Energy" },
            { level: 4, cost: 3000, benefit: "Faster Energy Regen" },
            { level: 5, cost: 7000, benefit: "Unlimited Energy Mode (1hr/day)" }
        ],
        path: "weight-room/building-weight-room"
    },
    practice_field: {
        name: "Practice Field",
        levels: [
            { level: 1, cost: 0, benefit: "Drills Unlocked" },
            { level: 2, cost: 500, benefit: "New Mini-Games" },
            { level: 3, cost: 1200, benefit: "+10% Drill Score" },
            { level: 4, cost: 2500, benefit: "Pro Difficulty Unlocked" },
            { level: 5, cost: 6000, benefit: "Legendary Coaches Visit" }
        ],
        path: "practice-field/building-practice-field"
    },
    headquarters: {
        name: "Headquarters",
        levels: [
            { level: 1, cost: 0, benefit: "Club Established" },
            { level: 2, cost: 2000, benefit: "Unlock Decor Slots" },
            { level: 3, cost: 5000, benefit: "Daily Login Bonus x2" },
            { level: 4, cost: 10000, benefit: "Create Custom Playbook" },
            { level: 5, cost: 25000, benefit: "Global Leaderboard Access" }
        ],
        path: "headquarters/building-headquarters"
    }
};

const DECOR_ITEMS = [
    { id: 'team_bus', name: 'Team Bus', cost: 5000, path: 'decor-team-bus', position: 'bottom-20 left-10 md:left-32' },
    { id: 'tailgate_tent', name: 'Tailgate Tent', cost: 2500, path: 'decor-tailgate-tent', position: 'top-20 right-10 md:right-32' },
    { id: 'statue_legends', name: 'Statue of Legends', cost: 15000, path: 'decor-statue-legends', position: 'bottom-32 right-1/3' },
    { id: 'club_fountain', name: 'Club Fountain', cost: 8000, path: 'decor-club-fountain', position: 'top-32 left-1/3' },
    { id: 'merch_stand', name: 'Merch Stand', cost: 3500, path: 'decor-merch-stand', position: 'bottom-10 right-10 md:right-32' },
    { id: 'parking_lot', name: 'Parking Lot', cost: 2000, path: 'decor-parking-lot', position: 'top-10 left-10 md:left-20' }
];

// Helper to get building image path based on level
const getBuildingImage = (path: string, level: number) => {
    // If level 3 asset exists (stadium, film-room, weight-room), use it for levels 3 and 4
    // Otherwise fallback to level 1 for 1-4, and level 5 for 5
    // Actually, we have L1, L3, L5 for some.
    // Logic:
    // L5 -> level-5
    // L3, L4 -> level-3 (if exists) OR level-1
    // L1, L2 -> level-1

    if (level >= 5) return `${path}-level-5`;

    const hasLevel3 = path.includes('stadium') || path.includes('film-room') || path.includes('weight-room');
    if (level >= 3 && hasLevel3) return `${path}-level-3`;

    return `${path}-level-1`;
};

import { FountainParticles } from './particles/fountain-particles';
import { LevelUpEffect } from './particles/level-up-effect';

interface HqBuilderProps {
    initialData: any;
}

export default function HqBuilder({ initialData }: HqBuilderProps) {
    const { toast } = useToast();
    const [hqState, setHqState] = useState(initialData || DEFAULT_HQ_STATE);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isPurchasingDecor, setIsPurchasingDecor] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);

    // Sync with server data updates
    useEffect(() => {
        if (initialData) {
            setHqState(initialData);
        }
    }, [initialData]);

    const handleUpgrade = async (buildingKey: keyof typeof UPGRADES) => {
        const currentLevel = hqState[`${buildingKey}_level` as keyof typeof hqState] as number;
        const nextLevelInfo = UPGRADES[buildingKey].levels.find(l => l.level === currentLevel + 1);

        if (!nextLevelInfo) return;
        if (hqState.coins < nextLevelInfo.cost) {
            toast({
                title: "Insufficient coins!",
                description: `You need ${nextLevelInfo.cost - hqState.coins} more coins.`,
                variant: "destructive"
            });
            return;
        }

        setIsUpgrading(true);
        try {
            const result = await upgradeBuilding(buildingKey, nextLevelInfo.cost);
            if (result.success) {
                // Trigger Level Up Effect
                setShowLevelUp(true);

                toast({
                    title: "Upgrade Successful!",
                    description: `Upgraded ${UPGRADES[buildingKey].name} to Level ${currentLevel + 1}!`,
                });
                // Optimistic update (server revalidation will also happen)
                setHqState((prev: any) => ({
                    ...prev,
                    [`${buildingKey}_level`]: currentLevel + 1,
                    coins: prev.coins - nextLevelInfo.cost
                }));
            } else {
                toast({
                    title: "Upgrade Failed",
                    description: result.error || "Unknown error occurred",
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
            setIsUpgrading(false);
        }
    };

    const handlePurchaseDecor = async (decor: typeof DECOR_ITEMS[0]) => {
        if (hqState.coins < decor.cost) {
            toast({
                title: "Insufficient coins!",
                description: `You need ${decor.cost - hqState.coins} more coins.`,
                variant: "destructive"
            });
            return;
        }

        setIsPurchasingDecor(true);
        try {
            const result = await purchaseDecor(decor.id, decor.cost);
            if (result.success) {
                toast({
                    title: "Purchase Successful!",
                    description: `You bought the ${decor.name}!`,
                });
                setHqState((prev: any) => ({
                    ...prev,
                    coins: prev.coins - decor.cost,
                    decor_slots: [...(prev.decor_slots || []), decor.id]
                }));
            } else {
                toast({
                    title: "Purchase Failed",
                    description: result.error || "Unknown error occurred",
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
            setIsPurchasingDecor(false);
        }
    };

    const ownedDecor = Array.isArray(hqState.decor_slots) ? hqState.decor_slots : [];

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-24">
            {/* Top Bar */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/20">
                            HQ
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">Club Headquarters</h1>
                            <p className="text-xs text-slate-400">Manage your franchise</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            <span className="font-mono font-bold text-yellow-500">{hqState.coins?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="font-mono font-bold text-blue-500">{hqState.xp?.toLocaleString() || 0} XP</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

                {/* Main Campus View (The "Grid") */}
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl group">
                    {/* Level Up Overlay */}
                    <LevelUpEffect isVisible={showLevelUp} onComplete={() => setShowLevelUp(false)} />

                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Central HQ */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 transition-transform hover:scale-105 cursor-pointer z-10">
                        <div className="relative animate-float-slow"> {/* Added simple float animation class if available, or just rely on hover */}
                            <Image
                                src={`/kickoff-club-assets/buildings/${getBuildingImage(UPGRADES.headquarters.path, hqState.headquarters_level)}@2x.png`}
                                alt="HQ"
                                width={512}
                                height={512}
                                className="drop-shadow-2xl"
                            />
                            <Badge className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border-slate-700 text-xs">
                                Lvl {hqState.headquarters_level} HQ
                            </Badge>
                        </div>
                    </div>

                    {/* Stadium (Top Left) */}
                    <div className="absolute top-10 left-10 md:left-20 w-48 md:w-72 transition-transform hover:scale-105 cursor-pointer opacity-90 hover:opacity-100">
                        <div className="relative">
                            <Image
                                src={`/kickoff-club-assets/buildings/${getBuildingImage(UPGRADES.stadium.path, hqState.stadium_level)}@2x.png`}
                                alt="Stadium"
                                width={512}
                                height={512}
                                className="drop-shadow-xl"
                            />
                            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 border-slate-700 text-xs">
                                Lvl {hqState.stadium_level} Stadium
                            </Badge>
                        </div>
                    </div>

                    {/* Practice Field (Bottom Right) */}
                    <div className="absolute bottom-10 right-10 md:right-20 w-48 md:w-72 transition-transform hover:scale-105 cursor-pointer opacity-90 hover:opacity-100">
                        <div className="relative">
                            <Image
                                src={`/kickoff-club-assets/buildings/${getBuildingImage(UPGRADES.practice_field.path, hqState.practice_field_level)}@2x.png`}
                                alt="Practice Field"
                                width={512}
                                height={512}
                                className="drop-shadow-xl"
                            />
                            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 border-slate-700 text-xs">
                                Lvl {hqState.practice_field_level} Field
                            </Badge>
                        </div>
                    </div>

                    {/* Render Owned Decor */}
                    {DECOR_ITEMS.map((item) => {
                        if (ownedDecor.includes(item.id)) {
                            return (
                                <div key={item.id} className={`absolute ${item.position} w-32 md:w-48 transition-transform hover:scale-105 cursor-pointer z-20`}>
                                    <div className="relative">
                                        <Image
                                            src={`/kickoff-club-assets/decor/${item.path}@2x.png`}
                                            alt={item.name}
                                            width={512}
                                            height={512}
                                            className="drop-shadow-lg"
                                        />
                                        {/* Particle Effects for specific items */}
                                        {item.id === 'club_fountain' && (
                                            <div className="absolute top-0 left-0 w-full h-full z-10 opacity-70">
                                                <FountainParticles />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Upgrade Control Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ArrowUpCircle className="text-orange-500" />
                            Building Upgrades
                        </h2>

                        <div className="grid gap-4">
                            {Object.entries(UPGRADES).map(([key, data]) => {
                                const currentLevel = hqState[`${key}_level` as keyof typeof hqState] as number;
                                const nextLevel = data.levels.find(l => l.level === currentLevel + 1);
                                const isMaxed = currentLevel >= 5;

                                return (
                                    <Card key={key} className="bg-slate-900/50 border-slate-800">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="w-20 h-20 bg-slate-950 rounded-lg border border-slate-800 p-2 flex-shrink-0">
                                                <Image
                                                    src={`/kickoff-club-assets/buildings/${getBuildingImage(data.path, currentLevel)}@2x.png`}
                                                    alt={data.name}
                                                    width={128}
                                                    height={128}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-lg text-slate-200">{data.name}</h3>
                                                    <Badge variant={isMaxed ? "default" : "outline"} className={isMaxed ? "bg-orange-500" : "text-slate-400"}>
                                                        Lvl {currentLevel}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-400 mb-2">
                                                    Current: <span className="text-slate-300">{data.levels.find(l => l.level === currentLevel)?.benefit}</span>
                                                </p>

                                                {!isMaxed && nextLevel && (
                                                    <div className="flex items-center gap-2 text-xs text-green-400">
                                                        <ArrowUpCircle className="w-3 h-3" />
                                                        Next: {nextLevel.benefit}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-shrink-0">
                                                {isMaxed ? (
                                                    <Button disabled className="bg-slate-800 text-slate-500 w-32">Maxed Out</Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleUpgrade(key as keyof typeof UPGRADES)}
                                                        disabled={hqState.coins < (nextLevel?.cost || 0) || isUpgrading}
                                                        className={`w-32 font-bold ${hqState.coins >= (nextLevel?.cost || 0) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-800 text-slate-500'}`}
                                                    >
                                                        {isUpgrading ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : nextLevel?.cost === 0 ? 'Free' : (
                                                            <span className="flex items-center gap-1">
                                                                <Coins className="w-3 h-3" />
                                                                {nextLevel?.cost.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar: Stats & Decor */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900/80 border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="text-yellow-500" />
                                    Club Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <span className="text-slate-400">Total Value</span>
                                    <span className="font-mono font-bold text-green-400">$2.4M</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <span className="text-slate-400">Fan Base</span>
                                    <span className="font-mono font-bold text-blue-400">12.5K</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <span className="text-slate-400">League Rank</span>
                                    <span className="font-mono font-bold text-orange-400">#42</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/80 border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Lock className="w-4 h-4" />
                                    Decor Shop
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {hqState.headquarters_level >= 2 ? (
                                    <div className="space-y-4">
                                        {DECOR_ITEMS.map((item) => {
                                            const isOwned = ownedDecor.includes(item.id);
                                            return (
                                                <div key={item.id} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-slate-900 rounded border border-slate-800 p-1">
                                                            <Image
                                                                src={`/kickoff-club-assets/decor/${item.path}@2x.png`}
                                                                alt={item.name}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{item.name}</p>
                                                            {!isOwned && (
                                                                <p className="text-xs text-yellow-500 flex items-center gap-1">
                                                                    <Coins className="w-3 h-3" />
                                                                    {item.cost.toLocaleString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {isOwned ? (
                                                        <Badge variant="outline" className="text-green-500 border-green-500/50">Owned</Badge>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            disabled={hqState.coins < item.cost || isPurchasingDecor}
                                                            onClick={() => handlePurchaseDecor(item)}
                                                        >
                                                            Buy
                                                        </Button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4">
                                        Upgrade Headquarters to Level 2 to unlock decor slots.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
