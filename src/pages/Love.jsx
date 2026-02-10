import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLovePage } from "../firebase/loveService";
import confetti from "canvas-confetti";

// --- ASSETS ---
const NOISE_BG = "https://www.transparenttextures.com/patterns/stardust.png";
const MUSIC_URL = "/song.mp3"; // Ensure this file exists in your /public folder

// --- ANIMATION CSS ---
const styles = `
    @keyframes fade-in {
        0% { opacity: 0; transform: translateY(20px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes heartbeat {
        0% { transform: scale(1); opacity: 0.5; }
        15% { transform: scale(1.15); opacity: 0.8; }
        30% { transform: scale(1); opacity: 0.5; }
        45% { transform: scale(1.15); opacity: 0.8; }
        60% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(1); opacity: 0.5; }
    }
    .animate-enter { animation: fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
    .animate-heartbeat { animation: heartbeat 1.5s infinite ease-in-out; }
    
    .glass-text { text-shadow: 0 0 20px rgba(255,255,255,0.3); }
`;

export default function Love() {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- DATA STATE ---
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- UI STATE ---
    const [step, setStep] = useState(0);
    const [accepted, setAccepted] = useState(false);
    const [isLocked, setIsLocked] = useState(true); // Feature: Security Gate
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [wrongAnswer, setWrongAnswer] = useState(false);
    const [isHoldingHeart, setIsHoldingHeart] = useState(false); // Feature: Heartbeat

    // --- AUDIO & INTERACTION ---
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [noBtnPos, setNoBtnPos] = useState({ top: "0%", left: "0%", position: "relative" });
    const [runCount, setRunCount] = useState(0);

    // 1. FETCH DATA & SETUP AUDIO
    useEffect(() => {
        const init = async () => {
            try {
                const doc = await getLovePage(id);
                if (doc) setData(doc);
            } catch (error) {
                console.error("Error loading story:", error);
            } finally {
                setLoading(false);
            }
        };
        init();

        // Initialize Audio
        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.6;

        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, [id]);

    // 2. LOADING GUARDS (Crucial to prevent crashes)
    if (loading) return <div className="bg-black min-h-screen flex items-center justify-center text-rose-500 animate-pulse">Loading Story...</div>;
    if (!data) return <div className="bg-black text-white min-h-screen flex items-center justify-center">Story not found.</div>;

    // --- SLIDES CONFIGURATION ---
    const slides = [
        { type: 'intro' },
        { title: "I've been thinking...", body: "About the moment everything changed." },
        { title: "The Spark", quote: data.answers.realization, hasVoice: true },
        { type: 'location', title: "Where It Started", body: "Do you remember this place?" },
        { title: "Unforgettable", quote: data.answers.memory },
        { title: "The Little Things", quote: data.answers.smallThing },
        { title: "A Secret", quote: data.answers.secret },
        { type: 'heartbeat' },
        { title: "My Promise", quote: data.answers.promise },
        { type: 'valentine' }
    ];

    const currentSlide = slides[step];

    // --- LOGIC HANDLERS ---

    // Unified Tap Handler (Fixes "Nothing happening on tap")
    const handleGlobalTap = () => {
        if (isLocked) return; // Block touches if locked
        if (accepted) return; // Block touches if finished

        // Case 1: Start the Story (Step 0)
        if (step === 0) {
            handleStart();
            setStep(1);
            return;
        }

        // Case 2: Special Slides (Disable tap to advance)
        if (currentSlide.type === 'heartbeat' || currentSlide.type === 'valentine') {
            return;
        }

        // Case 3: Normal Slide -> Next Slide
        if (step < slides.length - 1) {
            setStep(prev => prev + 1);
        }
    };

    const handleStart = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio autoplay blocked by browser", e));
            setIsPlaying(true);
        }
    };

    // Feature: Security Gate Unlock
    const handleUnlock = (e) => {
        e.stopPropagation();
        const answer = data.partner.nickname || data.partner.name;
        if (securityAnswer.toLowerCase().trim() === answer.toLowerCase().trim()) {
            setIsLocked(false);
            handleStart(); // Start music on unlock
        } else {
            setWrongAnswer(true);
            setTimeout(() => setWrongAnswer(false), 500);
        }
    };

    // Feature: Heartbeat Haptics
    const startHeartbeat = (e) => {
        e.stopPropagation(); // Prevent global tap
        setIsHoldingHeart(true);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 1000]); // Thump-thump

        // Auto advance after holding
        setTimeout(() => {
            setIsHoldingHeart(false);
            setStep(s => s + 1);
        }, 3000);
    };

    const stopHeartbeat = () => {
        setIsHoldingHeart(false);
        if (navigator.vibrate) navigator.vibrate(0);
    };

    // Feature: Voice Note Toggle
    const toggleAudio = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Feature: Time Capsule
    const checkTimeCapsule = (e) => {
        e.stopPropagation();
        alert(`🔒 LOCKED UNTIL 2027.\n\nThis is my promise that we'll still be together next year.`);
    };

    // Feature: Valentine Yes
    const handleYes = () => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setAccepted(true);
    };

    // Feature: Runaway No Button
    const moveNoButton = (e) => {
        e.stopPropagation();
        const x = Math.random() * 70 + 10;
        const y = Math.random() * 70 + 10;
        setNoBtnPos({ position: "absolute", top: `${y}%`, left: `${x}%` });
        setRunCount(prev => prev + 1);
    };

    return (
        <div
            className="relative min-h-screen bg-black text-white font-serif overflow-hidden select-none cursor-pointer"
            onClick={handleGlobalTap}
        >
            <style>{styles}</style>

            {/* --- BACKGROUNDS --- */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: `url(${NOISE_BG})` }} />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px] transition-all duration-[3000ms] ${step % 2 === 0 ? 'opacity-40 translate-y-10' : 'opacity-20 -translate-y-10'}`} />
            </div>

            {/* --- FEATURE: LOCKED GATE --- */}
            {isLocked && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-8 cursor-default">
                    <div className="w-16 h-16 mb-6 text-rose-500 animate-pulse">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9h-1V6a5 5 0 00-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zM9 6a3 3 0 116 0v2H9V6z"/></svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Security Check</h2>
                    <p className="text-white/50 mb-8 text-center text-sm">To prove it's you, what is the nickname I gave you?</p>

                    <input
                        type="text"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        placeholder="Enter nickname..."
                        className={`bg-transparent border-b-2 ${wrongAnswer ? 'border-red-500 animate-shake' : 'border-white/20'} text-center text-2xl py-2 outline-none mb-8 w-full max-w-xs focus:border-rose-500 transition-colors text-white`}
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={handleUnlock}
                        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                    >
                        Unlock Story 🔓
                    </button>
                </div>
            )}

            {/* --- MAIN STORY CONTAINER --- */}
            {!isLocked && (
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-12 text-center">

                    {/* PROGRESS BAR */}
                    <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
                        <div className="h-full bg-rose-600 transition-all duration-700 ease-out" style={{ width: `${(step / (slides.length - 1)) * 100}%` }} />
                    </div>

                    {/* --- SLIDE RENDERER --- */}

                    {/* 0. INTRO */}
                    {step === 0 && (
                        <div className="animate-enter flex flex-col items-center gap-8">
                            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Private Story For</p>
                            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 glass-text">
                                {data.partner.name}
                            </h1>
                            <p className="mt-12 text-[10px] uppercase tracking-widest opacity-40 animate-pulse">Tap to Open</p>
                        </div>
                    )}

                    {/* FEATURE: LOCATION */}
                    {currentSlide.type === 'location' && (
                        <div className="animate-enter max-w-2xl">
                            <div className="w-full aspect-video bg-slate-800 rounded-2xl mb-8 flex items-center justify-center border border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=12&size=600x300')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
                                <div className="z-10 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center shadow-[0_0_30px_#e11d48] animate-bounce">
                                    📍
                                </div>
                            </div>
                            <h2 className="text-3xl font-light mb-4">{currentSlide.title}</h2>
                            <p className="text-white/60">{currentSlide.body}</p>
                        </div>
                    )}

                    {/* FEATURE: HEARTBEAT */}
                    {currentSlide.type === 'heartbeat' && (
                        <div
                            className="animate-enter flex flex-col items-center z-50"
                            onMouseDown={startHeartbeat}
                            onMouseUp={stopHeartbeat}
                            onTouchStart={startHeartbeat}
                            onTouchEnd={stopHeartbeat}
                        >
                            <div className={`w-32 h-32 rounded-full border border-rose-500/30 flex items-center justify-center transition-all duration-200 ${isHoldingHeart ? 'scale-110 bg-rose-500/20 shadow-[0_0_50px_#e11d48]' : 'scale-100'}`}>
                                <div className={`w-20 h-20 bg-rose-600 rounded-full ${isHoldingHeart ? 'animate-heartbeat' : ''}`}></div>
                            </div>
                            <h2 className="text-2xl font-light mt-12 mb-4">Connect</h2>
                            <p className="text-white/50 text-sm tracking-widest uppercase">
                                {isHoldingHeart ? "Syncing..." : "Hold your thumb here"}
                            </p>
                        </div>
                    )}

                    {/* STANDARD SLIDES */}
                    {!currentSlide.type && (
                        <div key={step} className="animate-enter max-w-3xl relative">
                            <h3 className="text-sm text-rose-500 font-bold uppercase tracking-[0.3em] mb-8 opacity-80">{currentSlide.title}</h3>

                            {currentSlide.body && <h2 className="text-4xl leading-tight font-light text-white/90">{currentSlide.body}</h2>}

                            {currentSlide.quote && (
                                <div className="relative py-8">
                                    <p className="text-3xl md:text-4xl leading-relaxed font-light text-white/90 italic">"{currentSlide.quote}"</p>
                                </div>
                            )}

                            {/* FEATURE: VOICE NOTE */}
                            {currentSlide.hasVoice && (
                                <button
                                    onClick={toggleAudio}
                                    className="mt-8 px-6 py-2 rounded-full border border-white/20 flex items-center gap-3 hover:bg-white/10 transition mx-auto z-50"
                                >
                                    <span className="text-rose-400">{isPlaying ? "❚❚" : "▶"}</span>
                                    <span className="text-xs uppercase tracking-widest">Voice Note</span>
                                    <div className="flex gap-1 h-3 items-end">
                                        {[1,2,3,2,1].map((h,i) => <div key={i} className={`w-1 bg-white/50 ${isPlaying ? 'animate-pulse' : ''}`} style={{height: `${h*4}px`}}/>)}
                                    </div>
                                </button>
                            )}
                        </div>
                    )}

                    {/* VALENTINE QUESTION */}
                    {currentSlide.type === 'valentine' && !accepted && (
                        <div className="animate-enter w-full max-w-4xl flex flex-col items-center">
                            <h1 className="text-6xl md:text-8xl font-medium mb-6 leading-none">
                                Be My <br/> <span className="text-rose-500 italic font-light">Valentine?</span>
                            </h1>
                            <div className="flex flex-col md:flex-row items-center gap-6 mt-12 h-32 w-full justify-center relative">
                                <button onClick={(e) => { e.stopPropagation(); handleYes(); }} className="z-20 px-12 py-4 bg-white text-black text-xl font-bold rounded-full hover:scale-110 transition-transform">YES ❤️</button>
                                <button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} style={noBtnPos} className="z-10 px-8 py-4 border border-white/20 text-white/40 text-sm font-bold rounded-full transition-all duration-100 ease-out">No</button>
                            </div>
                        </div>
                    )}

                    {/* SUCCESS & TIME CAPSULE */}
                    {accepted && (
                        <div className="animate-enter flex flex-col items-center gap-8">
                            <h1 className="text-5xl font-medium">I Knew It.</h1>
                            <p className="text-rose-200/80 text-lg">Forever starts now.</p>

                            <div className="flex gap-4 mt-8">
                                <button onClick={(e) => { e.stopPropagation(); navigate(`/gallery/${id}`); }} className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition">
                                    See Memories →
                                </button>

                                <button
                                    onClick={checkTimeCapsule}
                                    className="px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/10 transition flex items-center gap-2"
                                >
                                    <span>🔒</span> Open Capsule
                                </button>
                            </div>
                            <p className="text-[10px] text-white/30 mt-4 uppercase tracking-widest">Time Capsule locked until 2027</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}