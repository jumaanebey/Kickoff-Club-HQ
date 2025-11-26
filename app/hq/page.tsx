import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ASSETS = {
    units: [
        {
            name: "Offensive Line",
            path: "offensive-line",
            states: ["idle", "training", "ready"]
        },
        {
            name: "Skill Positions",
            path: "skill-positions",
            states: ["idle", "training", "ready"]
        },
        {
            name: "Defensive Line",
            path: "defensive-line",
            states: ["idle", "training", "ready"]
        },
        {
            name: "Secondary",
            path: "secondary",
            states: ["idle", "training", "ready"]
        },
        {
            name: "Special Teams",
            path: "special-teams",
            states: ["idle", "training", "ready"]
        }
    ],
    buildings: [
        {
            name: "Stadium (Level 1)",
            path: "stadium/building-stadium-level-1",
            type: "building"
        },
        {
            name: "Stadium (Level 5)",
            path: "stadium/building-stadium-level-5",
            type: "building"
        }
    ]
};

export default function ClubHQPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-300">
                            Kickoff Club HQ
                        </h1>
                        <p className="text-slate-400 mt-2">Asset Verification & Management System</p>
                    </div>
                    <Badge variant="outline" className="border-orange-500/50 text-orange-400 px-4 py-1">
                        v0.1.0 Alpha
                    </Badge>
                </div>

                <Tabs defaultValue="units" className="w-full">
                    <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
                        <TabsTrigger value="units">Training Units</TabsTrigger>
                        <TabsTrigger value="buildings">Buildings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="units" className="mt-8 space-y-8">
                        {ASSETS.units.map((unit) => (
                            <div key={unit.name} className="space-y-4">
                                <h2 className="text-2xl font-semibold text-slate-200 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-orange-500 rounded-full" />
                                    {unit.name}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {unit.states.map((state) => (
                                        <Card key={state} className="bg-slate-900/50 border-slate-800 overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                                                    {state} State
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <div className="relative aspect-square bg-slate-950/50 rounded-lg overflow-hidden border border-slate-800/50">
                                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <Image
                                                        src={`/kickoff-club-assets/units/${unit.path}/unit-${unit.path}-${state}@2x.png`}
                                                        alt={`${unit.name} ${state}`}
                                                        fill
                                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                                                    <span>512x512px</span>
                                                    <span className="font-mono">PNG</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="buildings" className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {ASSETS.buildings.map((building) => (
                                <Card key={building.name} className="bg-slate-900/50 border-slate-800 overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-200">{building.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="relative aspect-video bg-slate-950/50 rounded-lg overflow-hidden border border-slate-800/50">
                                            <Image
                                                src={`/kickoff-club-assets/buildings/${building.path}@2x.png`}
                                                alt={building.name}
                                                fill
                                                className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                                            <span>1024x1024px</span>
                                            <span className="font-mono">PNG</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
