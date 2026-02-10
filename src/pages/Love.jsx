import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLovePage } from "../firebase/loveService";
import confetti from "canvas-confetti";

// --- ASSETS ---
const NOISE_BG = "https://www.transparenttextures.com/patterns/stardust.png";
const MUSIC_URL = "/song.mp3";
// --- ANIMATION CSS ---
const styles = `
    @keyframes fade-in {
        0% { opacity: 0; transform: translateY(20px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes heartbeat {
        0% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 0.5; }
    }
    .animate-enter { animation: fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
    .animate-pulse-slow { animation: heartbeat 4s infinite ease-in-out; }
    
    .glass-text {
        text-shadow: 0 0 20px rgba(255,255,255,0.3);
    }
`;

export default function Love() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Story State
    const [step, setStep] = useState(0); // 0 = Intro, 1...N = Story, Last = Valentine
    const [accepted, setAccepted] = useState(false);
    const [musicStarted, setMusicStarted] = useState(false);

    // Runaway Button State
    const [noBtnPos, setNoBtnPos] = useState({ top: "0%", left: "0%", position: "relative" });
    const [runCount, setRunCount] = useState(0);

    const audioRef = useRef(new Audio(MUSIC_URL));

    useEffect(() => {
        const init = async () => {
            const doc = await getLovePage(id);
            if (doc) setData(doc);
            setLoading(false);
        };
        init();

        // Cleanup audio on unmount
        return () => {
            audioRef.current.pause();
        };
    }, [id]);

    // --- INTERACTION HANDLERS ---

    const handleStart = () => {
        setStep(1);
        setMusicStarted(true);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    };

    const handleNext = () => {
        if (step < slides.length - 1) {
            setStep(s => s + 1);
        }
    };

    const handleYes = () => {
        // Big Explosion
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#e11d48', '#ffffff'] });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#e11d48', '#ffffff'] });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
        setAccepted(true);
    };

    const moveNoButton = (e) => {
        e.stopPropagation();
        const x = Math.random() * 80 + 10; // 10% to 90%
        const y = Math.random() * 80 + 10;
        setNoBtnPos({ position: "absolute", top: `${y}%`, left: `${x}%` });
        setRunCount(c => c + 1);
    };

    if (loading) return <div className="bg-black min-h-screen" />;
    if (!data) return <div className="bg-black text-white min-h-screen flex items-center justify-center">Story not found.</div>;

    // --- STORY CONTENT MAPPING ---
    const slides = [
        { type: 'intro' }, // 0
        { title: "I've been thinking...", body: "About the moment everything changed." },
        { title: "The Spark", quote: data.answers.realization },
        { title: "Unforgettable", quote: data.answers.memory },
        { title: "The Little Things", quote: data.answers.smallThing },
        { title: "A Secret", quote: data.answers.secret },
        { title: "Why You?", quote: data.answers.admiration },
        { title: "My Promise", quote: data.answers.promise },
        { type: 'valentine' } // Last
    ];

    const currentSlide = slides[step];

    // --- RENDER ---
    return (
        <div
            className="relative min-h-screen bg-black text-white font-serif overflow-hidden select-none cursor-pointer"
            onClick={(!accepted && step > 0 && step < slides.length - 1) ? handleNext : undefined}
        >
            <style>{styles}</style>

            {/* --- CINEMATIC GRAIN OVERLAY --- */}
            <div
                className="fixed inset-0 pointer-events-none opacity-20 z-0"
                style={{ backgroundImage: `url(${NOISE_BG})` }}
            />

            {/* --- AMBIENT GLOW --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px] transition-all duration-[3000ms] ${step % 2 === 0 ? 'opacity-40 translate-y-10' : 'opacity-20 -translate-y-10'}`} />
                <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px] transition-all duration-[3000ms] ${step % 2 !== 0 ? 'opacity-40 translate-y-10' : 'opacity-20 -translate-y-10'}`} />
            </div>

            {/* --- PROGRESS BAR --- */}
            {step > 0 && !accepted && (
                <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
                    <div
                        className="h-full bg-rose-600 transition-all duration-700 ease-out shadow-[0_0_10px_#e11d48]"
                        style={{ width: `${(step / (slides.length - 1)) * 100}%` }}
                    />
                </div>
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-12 text-center">

                {/* 1. INTRO SCREEN */}
                {step === 0 && (
                    <div className="animate-enter flex flex-col items-center gap-8" onClick={handleStart}>
                        <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center animate-pulse-slow">
                            <span className="text-3xl">🎧</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-4">A Story For</p>
                            <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 glass-text">
                                {data.partner.name}
                            </h1>
                        </div>
                        <p className="mt-12 text-[10px] uppercase tracking-widest opacity-40 animate-pulse">Tap to begin</p>
                    </div>
                )}

                {/* 2. STORY SLIDES */}
                {step > 0 && step < slides.length - 1 && (
                    <div key={step} className="animate-enter max-w-3xl">
                        <h3 className="text-sm md:text-base text-rose-500 font-bold uppercase tracking-[0.3em] mb-12 opacity-80">
                            {currentSlide.title}
                        </h3>

                        {currentSlide.body && (
                            <h2 className="text-3xl md:text-5xl leading-tight font-light text-white/90">
                                {currentSlide.body}
                            </h2>
                        )}

                        {currentSlide.quote && (
                            <div className="relative">
                                <span className="absolute -top-10 -left-8 text-8xl text-white/10 font-serif">“</span>
                                <p className="text-2xl md:text-4xl leading-relaxed font-light text-white/90">
                                    {currentSlide.quote}
                                </p>
                                <span className="absolute -bottom-16 -right-8 text-8xl text-white/10 font-serif">”</span>
                            </div>
                        )}

                        <div className="fixed bottom-10 left-0 w-full text-center">
                            <p className="text-[10px] text-white/20 uppercase tracking-widest">Tap to continue</p>
                        </div>
                    </div>
                )}

                {/* 3. THE VALENTINE QUESTION */}
                {step === slides.length - 1 && !accepted && (
                    <div className="animate-enter w-full max-w-4xl relative min-h-[60vh] flex flex-col items-center justify-center">
                        <h1 className="text-5xl md:text-8xl font-medium mb-6 leading-none tracking-tight">
                            Will you be my <br/>
                            <span className="text-rose-500 italic font-light">Valentine?</span>
                        </h1>
                        <p className="text-white/50 text-lg mb-12 font-sans tracking-wide">
                            {runCount > 2 ? "Please? 🥺" : "I don't want anyone else."}
                        </p>

                        <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center relative h-32">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleYes(); }}
                                className="z-20 px-12 py-4 bg-white text-black text-xl font-bold rounded-full hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                            >
                                YES ❤️
                            </button>

                            <button
                                onMouseEnter={moveNoButton}
                                onTouchStart={moveNoButton}
                                style={noBtnPos}
                                className="z-10 px-8 py-4 border border-white/20 text-white/40 text-sm font-bold rounded-full transition-all duration-150 ease-out"
                            >
                                No
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. SUCCESS SCREEN */}
                {accepted && (
                    <div className="animate-enter flex flex-col items-center gap-8">
                        <div className="w-32 h-32 bg-rose-600 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(225,29,72,0.6)] animate-pulse-slow">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-medium">
                            I Knew It.
                        </h1>
                        <p className="text-rose-200/80 text-lg tracking-wide font-sans">
                            Forever starts now.
                        </p>

                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/gallery/${id}`); }}
                            className="mt-8 px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-white font-sans text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                        >
                            SEE OUR MEMORIES →
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}