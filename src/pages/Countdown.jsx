import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// A target date (Valentine's Day Midnight)
const TARGET_DATE = new Date("2026-02-14T00:00:00");

export default function Countdown() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [unlocked, setUnlocked] = useState(false);

    function calculateTimeLeft() {
        const difference = +TARGET_DATE - +new Date();

        if (difference <= 0) return null;

        return {
            // 1. ADDED DAYS CALCULATION
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            if (!remaining) {
                clearInterval(timer);
                navigate(`/love/${id}`);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleEnter = () => {
        navigate(`/love/${id}`);
    };

    // Helper to format key names (days -> DAYS)
    const formatUnit = (unit) => unit.toUpperCase();

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">

            {/* Background Pulse */}
            <div className="absolute inset-0 bg-rose-900/20 animate-pulse"></div>

            {unlocked ? (
                // --- UNLOCKED STATE ---
                <div className="z-10 text-center animate-in fade-in zoom-in duration-1000 px-4">
                    <h1 className="text-5xl md:text-9xl font-black mb-8 text-rose-500">IT'S TIME.</h1>
                    <button
                        onClick={handleEnter}
                        className="px-12 py-6 bg-white text-black text-xl md:text-2xl font-bold rounded-full hover:scale-110 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                    >
                        Open My Heart 🔓
                    </button>
                </div>
            ) : (
                // --- LOCKED STATE ---
                <div className="z-10 text-center px-4">
                    <div className="mb-8 md:mb-12">
                        <span className="text-4xl md:text-6xl">🔒</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold uppercase tracking-[0.5em] mb-12 opacity-70">
                        Patience, my love...
                    </h2>

                    {/* TIMER GRID */}
                    <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                        {/* We map explicitly to ensure correct order */}
                        {timeLeft && ['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                            <div key={unit} className="flex flex-col items-center">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl md:text-5xl font-black border border-white/20 shadow-xl">
                                    {timeLeft[unit].toString().padStart(2, '0')}
                                </div>
                                <span className="text-[10px] md:text-xs uppercase mt-4 tracking-widest opacity-50">
                                    {formatUnit(unit)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="mt-16 text-sm opacity-40 animate-pulse">
                        Your surprise is being prepared...
                    </p>
                </div>
            )}
        </div>
    );
}