'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FootballFieldBg } from './football-field-bg';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/utils';

interface BuildingProps {
    id: string;
    name: string;
    level: number;
    imagePath: string;
    position: { x: number; y: number }; // Percentages 0-100
    onClick: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const Building = ({ name, level, imagePath, position, onClick, size = 'md' }: BuildingProps) => {
    const sizeClasses = {
        sm: 'w-24 h-24 md:w-32 md:h-32',
        md: 'w-32 h-32 md:w-48 md:h-48',
        lg: 'w-48 h-48 md:w-64 md:h-64'
    };

    return (
        <div
            className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 hover:z-50 group",
                sizeClasses[size]
            )}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <div className="relative w-full h-full">
                <Image
                    src={imagePath}
                    alt={name}
                    fill
                    className="object-contain drop-shadow-2xl filter group-hover:brightness-110 transition-all"
                />
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 border-slate-700 text-[10px] md:text-xs whitespace-nowrap z-10 pointer-events-none">
                    Lvl {level} {name}
                </Badge>
            </div>
        </div>
    );
};

interface CampusMapProps {
    buildings: Array<{
        id: string;
        name: string;
        level: number;
        imagePath: string;
        onClick: () => void;
    }>;
}

export const CampusMap = ({ buildings }: CampusMapProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    // Building Positions (Clash of Clans style layout)
    const POSITIONS: Record<string, { x: number, y: number, size: 'sm' | 'md' | 'lg' }> = {
        stadium: { x: 50, y: 45, size: 'lg' },         // Center Field
        practice_field: { x: 20, y: 55, size: 'md' },  // Left Sideline
        film_room: { x: 80, y: 25, size: 'sm' },       // Upper Right
        weight_room: { x: 80, y: 65, size: 'sm' },     // Right Sideline
        headquarters: { x: 50, y: 80, size: 'md' },    // Bottom Center
        medical_center: { x: 20, y: 30, size: 'sm' },  // Upper Left (New)
        scouting_office: { x: 80, y: 45, size: 'sm' }  // Right Center (New)
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.8, scale + delta), 2);
        setScale(newScale);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const newX = e.clientX - startPos.x;
        const newY = e.clientY - startPos.y;

        // Simple bounds checking could go here
        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[16/9] bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl cursor-move"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out origin-center"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    width: '120%', // Make canvas slightly larger
                    height: '120%',
                    left: '-10%',
                    top: '-10%'
                }}
            >
                <FootballFieldBg />

                {buildings.map((b) => {
                    const posKey = b.id.replace('_level', '').replace('building_', ''); // rough mapping
                    // Try to match exact keys first
                    let config = POSITIONS[b.id];

                    // Fallback matching
                    if (!config) {
                        if (b.id.includes('stadium')) config = POSITIONS.stadium;
                        else if (b.id.includes('practice')) config = POSITIONS.practice_field;
                        else if (b.id.includes('film')) config = POSITIONS.film_room;
                        else if (b.id.includes('weight')) config = POSITIONS.weight_room;
                        else if (b.id.includes('headquarters')) config = POSITIONS.headquarters;
                        else if (b.id.includes('medical')) config = POSITIONS.medical_center;
                        else if (b.id.includes('scouting')) config = POSITIONS.scouting_office;
                    }

                    if (!config) return null;

                    return (
                        <Building
                            key={b.id}
                            {...b}
                            position={config}
                            size={config.size}
                        />
                    );
                })}
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                    className="w-8 h-8 bg-slate-900/80 text-white rounded-full flex items-center justify-center border border-slate-700 hover:bg-slate-800"
                    onClick={() => setScale(Math.min(2, scale + 0.2))}
                >
                    +
                </button>
                <button
                    className="w-8 h-8 bg-slate-900/80 text-white rounded-full flex items-center justify-center border border-slate-700 hover:bg-slate-800"
                    onClick={() => setScale(Math.max(0.8, scale - 0.2))}
                >
                    -
                </button>
            </div>

            <div className="absolute top-4 left-4 bg-slate-900/50 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-700/50 pointer-events-none">
                Drag to Pan • Scroll to Zoom
            </div>
        </div>
    );
};
