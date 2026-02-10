// src/pages/Countdown.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// A target date (You would normally fetch this from your DB)
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
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            if (!remaining) {
                setUnlocked(true);
                clearInterval(timer);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleEnter = () => {
        // Add a cool transition sound here?
        navigate(`/love/${id}`);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">

            {/* Background Pulse */}
            <div className="absolute inset-0 bg-rose-900/20 animate-pulse"></div>

            {unlocked ? (
                // --- UNLOCKED STATE ---
                <div className="z-10 text-center animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-6xl md:text-9xl font-black mb-8 text-rose-500">IT'S TIME.</h1>
                    <button
                        onClick={handleEnter}
                        className="px-12 py-6 bg-white text-black text-2xl font-bold rounded-full hover:scale-110 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                    >
                        Open My Heart 🔓
                    </button>
                </div>
            ) : (
                // --- LOCKED STATE ---
                <div className="z-10 text-center">
                    <div className="mb-12">
                        <span className="text-4xl">🔒</span>
                    </div>
                    <h2 className="text-2xl font-bold uppercase tracking-[0.5em] mb-12 opacity-70">
                        Patience, my love...
                    </h2>

                    <div className="flex gap-6 justify-center">
                        {Object.entries(timeLeft || {}).map(([unit, value]) => (
                            <div key={unit} className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-5xl font-black border border-white/20 shadow-xl">
                                    {value.toString().padStart(2, '0')}
                                </div>
                                <span className="text-xs uppercase mt-4 tracking-widest opacity-50">{unit}</span>
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