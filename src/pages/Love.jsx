import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLovePage } from "../firebase/loveService";
import confetti from "canvas-confetti";

const NOISE_BG = "https://www.transparenttextures.com/patterns/stardust.png";
const MUSIC_URL = "/song.mp3";

const styles = `
    @keyframes fade-in { 0% { opacity: 0; transform: translateY(20px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes heartbeat { 0% { transform: scale(1); opacity: 0.5; } 15% { transform: scale(1.15); opacity: 0.8; } 30% { transform: scale(1); opacity: 0.5; } 45% { transform: scale(1.15); opacity: 0.8; } 60% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1); opacity: 0.5; } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
    @keyframes scan-line { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
    @keyframes equalizer { 0% { height: 10%; } 50% { height: 100%; } 100% { height: 10%; } }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    
    .animate-enter { animation: fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
    .animate-heartbeat { animation: heartbeat 1.5s infinite ease-in-out; }
    .animate-shake { animation: shake 0.4s ease-in-out; }
    .glass-text { text-shadow: 0 0 30px rgba(255,255,255,0.2); }
`;

export default function Love() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);

    const [accepted, setAccepted] = useState(false);
    const [isLocked, setIsLocked] = useState(true);
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [wrongAnswer, setWrongAnswer] = useState(false);
    const [isHoldingHeart, setIsHoldingHeart] = useState(false);

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [noBtnPos, setNoBtnPos] = useState({ top: "0%", left: "0%", position: "relative" });

    useEffect(() => {
        const init = async () => {
            try {
                const doc = await getLovePage(id);
                if (doc) setData(doc);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        init();

        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.6;

        return () => { if (audioRef.current) audioRef.current.pause(); };
    }, [id]);

    if (loading) return <div className="bg-black min-h-screen flex items-center justify-center text-rose-500 font-mono text-xs tracking-widest animate-pulse">ESTABLISHING CONNECTION...</div>;
    if (!data) return <div className="bg-black text-white min-h-screen flex items-center justify-center">Story not found.</div>;

    const slides = [
        { type: 'intro' },
        { type: 'holo-text', title: "I've been thinking...", body: "About the moment everything changed." },
        { type: 'voice-card', title: "The Spark", quote: data.answers.realization },
        { type: 'location', title: "Where It Started", body: "Do you remember this place?" },
        { type: 'memory-film', title: "Unforgettable", quote: data.answers.memory },
        { type: 'holo-text', title: "The Little Things", quote: data.answers.smallThing },
        { type: 'secret-file', title: "A Secret", quote: data.answers.secret },
        { type: 'heartbeat' },
        { type: 'promise-glass', title: "My Promise", quote: data.answers.promise },
        { type: 'valentine' }
    ];

    const currentSlide = slides[step] || slides[0];

    const handleGlobalTap = () => {
        if (isLocked || accepted) return;
        if (step === 0) {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio autoplay block", e));
                setIsPlaying(true);
            }
            setStep(1);
            return;
        }
        if (currentSlide.type === 'heartbeat' || currentSlide.type === 'valentine') return;
        if (step < slides.length - 1) setStep(prev => prev + 1);
    };

    const handleUnlock = (e) => {
        e.stopPropagation();
        const answer = data.partner.nickname || data.partner.name;
        if (securityAnswer.toLowerCase().includes(answer.toLowerCase().substring(0, 3))) {
            setIsLocked(false);
            if (audioRef.current) { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
        } else {
            setWrongAnswer(true);
            setTimeout(() => setWrongAnswer(false), 500);
        }
    };

    const startHeartbeat = (e) => {
        e.stopPropagation();
        setIsHoldingHeart(true);
        if (navigator.vibrate) navigator.vibrate([50, 50, 50, 1000]);
        setTimeout(() => { setIsHoldingHeart(false); setStep(s => s + 1); }, 3000);
    };

    const stopHeartbeat = () => { setIsHoldingHeart(false); if (navigator.vibrate) navigator.vibrate(0); };

    const handleYes = () => {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#e11d48', '#ffffff'] });
        setAccepted(true);
    };

    const moveNoButton = (e) => {
        e.stopPropagation();
        const x = Math.random() * 60 + 20;
        const y = Math.random() * 60 + 20;
        setNoBtnPos({ position: "absolute", top: `${y}%`, left: `${x}%` });
    };

    const checkTimeCapsule = (e) => {
        e.stopPropagation();
        alert("🔒 LOCKED UNTIL FEB 14, 2027.\n\nThis is my promise that we'll still be together next year.");
    };

    const toggleAudio = (e) => {
        e.stopPropagation();
        if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="relative min-h-screen bg-black text-white font-serif overflow-hidden select-none cursor-pointer" onClick={handleGlobalTap}>
            <style>{styles}</style>
            <div className="fixed inset-0 pointer-events-none opacity-10 z-0" style={{ backgroundImage: `url(${NOISE_BG})` }} />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px] transition-all duration-[2000ms] ${step % 2 === 0 ? 'opacity-40' : 'opacity-10'}`} />
            </div>

            {isLocked && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl p-8 cursor-default">
                    <div className="w-12 h-12 mb-8 text-rose-500 animate-pulse">🔒</div>
                    <h2 className="text-xl font-light tracking-widest uppercase mb-2">Identify Yourself</h2>
                    <p className="text-white/40 mb-8 text-center text-xs">What nickname did I give you?</p>
                    <input type="text" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} placeholder="..." className={`bg-transparent border-b ${wrongAnswer ? 'border-red-500 animate-shake' : 'border-white/20'} text-center text-3xl py-2 outline-none mb-12 w-full max-w-xs focus:border-rose-500 transition-colors text-white font-serif placeholder:text-white/10`} onClick={(e) => e.stopPropagation()} />
                    <button onClick={handleUnlock} className="px-10 py-3 bg-white text-black font-bold text-xs tracking-[0.2em] rounded-full hover:bg-rose-500 hover:text-white transition-colors uppercase">Access Story</button>
                </div>
            )}

            {!isLocked && (
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
                    {!accepted && <div className="fixed top-0 left-0 w-full h-0.5 bg-white/10 z-50"><div className="h-full bg-rose-600 transition-all duration-700 ease-out shadow-[0_0_20px_#e11d48]" style={{ width: `${(step / (slides.length - 1)) * 100}%` }} /></div>}

                    {/* INTRO */}
                    {step === 0 && (
                        <div className="animate-enter flex flex-col items-center gap-6">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Encrypted Channel</p>
                            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 glass-text">{data.partner.name}</h1>
                            <p className="mt-16 text-[9px] uppercase tracking-widest opacity-30 animate-pulse">Tap anywhere to begin</p>
                        </div>
                    )}

                    {currentSlide.type === 'holo-text' && (
                        <div className="animate-enter max-w-2xl relative p-8 border-l-2 border-r-2 border-white/10 bg-white/5 backdrop-blur-sm">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                            <h3 className="text-xs text-rose-400 font-mono mb-6 tracking-widest uppercase">{currentSlide.title}</h3>
                            <p className="text-2xl md:text-4xl font-light text-white/90 leading-relaxed">
                                {currentSlide.body || `"${currentSlide.quote}"`}
                            </p>
                        </div>
                    )}

                    {currentSlide.type === 'voice-card' && (
                        <div className="animate-enter max-w-xl w-full bg-[#111] border border-white/10 rounded-2xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse"></div>
                            <h3 className="text-xs text-white/40 font-mono mb-8 tracking-widest uppercase">{currentSlide.title}</h3>
                            <div className="flex gap-2 h-16 items-center justify-center mb-8 w-full">
                                {[...Array(15)].map((_,i) => (
                                    <div key={i} className="w-1 bg-rose-500 rounded-full" style={{ height: isPlaying ? `${Math.random() * 100}%` : '20%', animation: isPlaying ? `equalizer 0.5s infinite ${i * 0.1}s` : 'none', opacity: 0.8 }}></div>
                                ))}
                            </div>
                            <button onClick={toggleAudio} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                {isPlaying ? "II" : "▶"}
                            </button>
                            <p className="mt-6 text-xl font-serif italic text-white/80">"{currentSlide.quote}"</p>
                        </div>
                    )}

                    {currentSlide.type === 'location' && (
                        <div className="animate-enter w-full max-w-lg relative group">
                            <div className="w-full aspect-video bg-[#0f172a] rounded-xl border border-rose-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.15)] mb-8">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-r from-transparent via-rose-500/10 to-transparent opacity-50" style={{ animation: 'spin 4s linear infinite' }}></div>
                                <style>{`@keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }`}</style>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-rose-500/20 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_20px_#e11d48] animate-pulse"></div>
                                    <div className="w-0.5 h-8 bg-gradient-to-b from-rose-500 to-transparent opacity-50"></div>
                                </div>
                                <div className="absolute top-4 left-4 text-[10px] font-mono text-rose-300/80 tracking-widest">COORDINATES LOCKED</div>
                            </div>
                            <h2 className="text-3xl font-light mb-4">{currentSlide.title}</h2>
                            <p className="text-white/60 text-sm font-mono">{currentSlide.body}</p>
                        </div>
                    )}

                    {currentSlide.type === 'memory-film' && (
                        <div className="animate-enter max-w-2xl relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 to-purple-500/20 blur-xl opacity-50"></div>
                            <div className="relative bg-black/80 p-8 border-y-4 border-white/10">
                                <div className="flex justify-between items-center mb-6 opacity-30 text-[10px] font-mono">
                                    <span>REC ●</span>
                                    <span>00:04:20</span>
                                </div>
                                <h3 className="text-4xl font-serif italic text-white mb-6 leading-tight">"{currentSlide.quote}"</h3>
                                <p className="text-xs text-rose-400 font-bold uppercase tracking-widest">— {currentSlide.title}</p>
                            </div>
                        </div>
                    )}

                    {currentSlide.type === 'secret-file' && (
                        <div className="animate-enter max-w-lg relative bg-[#1a1a1a] p-8 -rotate-1 shadow-2xl border border-white/5">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="border border-red-500/50 text-red-500/50 text-[10px] px-2 py-1 font-bold uppercase -rotate-12">Top Secret</div>
                            </div>
                            <h3 className="text-xs text-white/30 font-mono mb-6 uppercase tracking-[0.3em]">Confidential / {currentSlide.title}</h3>
                            <p className="text-2xl font-serif text-white/90 leading-relaxed blur-[0.5px] hover:blur-none transition-all duration-500 cursor-text">
                                {currentSlide.quote}
                            </p>
                            <div className="mt-8 h-px w-full bg-white/10"></div>
                            <p className="mt-2 text-[9px] text-white/20 font-mono text-right">EYES ONLY</p>
                        </div>
                    )}

                    {currentSlide.type === 'promise-glass' && (
                        <div className="animate-enter max-w-2xl">
                            <div className="w-20 h-20 mx-auto mb-8 bg-white/5 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                <span className="text-3xl">🤞</span>
                            </div>
                            <h3 className="text-sm text-rose-300 font-bold uppercase tracking-[0.4em] mb-8">{currentSlide.title}</h3>
                            <div className="relative p-10 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent rounded-2xl"></div>
                                <p className="relative text-3xl md:text-5xl font-light text-white leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    "{currentSlide.quote}"
                                </p>
                            </div>
                        </div>
                    )}

                    {currentSlide.type === 'heartbeat' && (
                        <div className="animate-enter flex flex-col items-center z-50" onMouseDown={startHeartbeat} onMouseUp={stopHeartbeat} onTouchStart={startHeartbeat} onTouchEnd={stopHeartbeat}>
                            <div className={`w-40 h-40 rounded-full border border-rose-500/20 flex items-center justify-center transition-all duration-500 ${isHoldingHeart ? 'scale-110 bg-rose-900/10' : 'scale-100'}`}>
                                <div className={`w-24 h-24 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full shadow-[0_0_60px_rgba(225,29,72,0.6)] ${isHoldingHeart ? 'animate-heartbeat' : 'scale-100'}`}></div>
                            </div>
                            <h2 className="text-3xl font-light mt-12 mb-2">Connect</h2>
                            <p className="text-white/40 text-xs tracking-widest uppercase">{isHoldingHeart ? "Syncing Pulse..." : "Place Thumb & Hold"}</p>
                        </div>
                    )}

                    {currentSlide.type === 'valentine' && !accepted && (
                        <div className="animate-enter w-full max-w-4xl flex flex-col items-center">
                            <h1 className="text-5xl md:text-8xl font-medium mb-8 leading-none tracking-tight">Be My <br/> <span className="text-rose-600 italic font-serif">Valentine?</span></h1>
                            <div className="flex flex-col md:flex-row items-center gap-6 mt-8 h-40 w-full justify-center relative">
                                <button onClick={(e) => { e.stopPropagation(); handleYes(); }} className="z-20 px-16 py-5 bg-white text-black text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">YES ❤️</button>
                                <button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} style={noBtnPos} className="z-10 px-10 py-4 border border-white/20 text-white/30 text-xs font-bold rounded-full uppercase tracking-widest transition-all duration-100 ease-out">No</button>
                            </div>
                        </div>
                    )}

                    {accepted && (
                        <div className="animate-enter flex flex-col items-center gap-10">
                            <h1 className="text-5xl font-medium">I Knew It.</h1>
                            <p className="text-rose-200/80 text-4xl font-serif italic">I Love You ❤️</p>
                            <div className="flex gap-4 mt-8">
                                <button onClick={(e) => { e.stopPropagation(); navigate(`/gallery/${id}`); }} className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition">See Memories 📸</button>
                                <button onClick={checkTimeCapsule} className="px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/10 transition flex items-center gap-2"><span>🔒</span> Open Capsule</button>
                            </div>
                            <p className="text-[10px] text-white/20 max-w-xs text-center leading-relaxed mt-8">🔒 Privacy: Images are deleted from the server after viewing.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}