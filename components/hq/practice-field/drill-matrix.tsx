'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getUserDrills, startDrill, collectDrillReward, DRILL_TYPES, DrillSlot } from '@/app/actions/drills';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Zap, Dumbbell, Video, CheckCircle2, Timer } from 'lucide-react';
import { cn } from '@/shared/utils';

const ICONS = {
    Zap: Zap,
    Dumbbell: Dumbbell,
    Video: Video
};

export function DrillMatrix() {
    const [slots, setSlots] = useState<DrillSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadDrills();
        // Poll for updates every 10s
        const interval = setInterval(loadDrills, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadDrills = async () => {
        const result = await getUserDrills();
        if (result.success && result.data) {
            setSlots(result.data);
        }
        setIsLoading(false);
    };

    const handleStartDrill = async (type: string) => {
        if (selectedSlot === null) return;

        setIsDialogOpen(false);
        // Optimistic update
        setSlots(prev => prev.map(s => s.slot_index === selectedSlot ? { ...s, status: 'active', drill_type: type, end_time: new Date(Date.now() + DRILL_TYPES[type as keyof typeof DRILL_TYPES].duration * 1000).toISOString() } : s));

        const result = await startDrill(selectedSlot, type as any);
        if (!result.success) {
            toast({ title: "Failed to start drill", variant: "destructive" });
            loadDrills(); // Revert
        } else {
            toast({ title: "Drill Started!", description: "Training in progress..." });
        }
    };

    const handleCollect = async (slotIndex: number) => {
        const result = await collectDrillReward(slotIndex);
        if (result.success) {
            toast({
                title: "Drill Complete! 🎉",
                description: `Earned ${result.rewards?.coins} Coins & ${result.rewards?.xp} XP`,
            });
            // Clear slot locally
            setSlots(prev => prev.map(s => s.slot_index === slotIndex ? { slot_index: slotIndex } : s));
        } else {
            toast({ title: "Collection Failed", description: result.error, variant: "destructive" });
        }
    };

    if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {slots.map((slot) => {
                const isOccupied = !!slot.drill_type;
                const isComplete = isOccupied && new Date() >= new Date(slot.end_time!);
                const drillConfig = isOccupied ? DRILL_TYPES[slot.drill_type as keyof typeof DRILL_TYPES] : null;
                const Icon = drillConfig ? ICONS[drillConfig.icon as keyof typeof ICONS] : null;

                return (
                    <div key={slot.slot_index} className="aspect-square">
                        {isOccupied ? (
                            <Card
                                className={cn(
                                    "w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all border-2",
                                    isComplete
                                        ? "bg-green-900/20 border-green-500 hover:bg-green-900/30 animate-pulse"
                                        : "bg-slate-900 border-slate-700"
                                )}
                                onClick={() => isComplete && handleCollect(slot.slot_index)}
                            >
                                {isComplete ? (
                                    <>
                                        <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                                        <span className="text-xs font-bold text-green-400">Collect</span>
                                    </>
                                ) : (
                                    <>
                                        {Icon && <Icon className="w-8 h-8 text-orange-500 mb-2 animate-bounce" />}
                                        <span className="text-xs text-slate-400 text-center px-1">{drillConfig?.name}</span>
                                        <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center gap-1">
                                            <Timer className="w-3 h-3" />
                                            Wait...
                                        </div>
                                    </>
                                )}
                            </Card>
                        ) : (
                            <Dialog open={isDialogOpen && selectedSlot === slot.slot_index} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) setSelectedSlot(null);
                            }}>
                                <DialogTrigger asChild>
                                    <button
                                        className="w-full h-full rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-orange-500/50 transition-all flex flex-col items-center justify-center group"
                                        onClick={() => setSelectedSlot(slot.slot_index)}
                                    >
                                        <Plus className="w-8 h-8 text-slate-600 group-hover:text-orange-500 transition-colors" />
                                        <span className="text-xs text-slate-600 mt-2 group-hover:text-slate-400">New Drill</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                                    <DialogHeader>
                                        <DialogTitle>Select a Drill</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 mt-4">
                                        {Object.entries(DRILL_TYPES).map(([key, config]) => {
                                            const TypeIcon = ICONS[config.icon as keyof typeof ICONS];
                                            return (
                                                <div
                                                    key={key}
                                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500 cursor-pointer transition-all"
                                                    onClick={() => handleStartDrill(key)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                                                            <TypeIcon className="w-5 h-5 text-orange-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">{config.name}</h4>
                                                            <p className="text-xs text-slate-400">{config.duration / 60} min • {config.xp} XP • {config.coins} Coins</p>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="ghost" className="text-orange-500">Start</Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
