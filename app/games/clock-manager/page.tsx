import React from 'react';
import { Metadata } from 'next';
import { ClockManagerGame } from '@/components/games/clock-manager';
import { Timer } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Clock Manager | Kickoff Club HQ',
    description: 'Master the two-minute drill in this high-pressure simulation.',
};

export default function ClockManagerPage() {
    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <div className="bg-slate-900 border-b border-slate-800 p-4 mb-8">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Timer className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Clock Manager</h1>
                        <p className="text-sm text-slate-400">Master the two-minute drill. Manage the clock, call the plays, and lead the drive.</p>
                    </div>
                </div>
            </div>

            <ClockManagerGame />
        </div>
    );
}
