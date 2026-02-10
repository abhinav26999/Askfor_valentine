import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    createLovePage,
    updateLovePage,
    getLovePage,
} from "../firebase/loveService";
import { creatorChapters } from "../data/creatorChapters";

// --- CONFIG ---
const DRAFT_KEY = "love_draft_id";
const allQuestions = creatorChapters.flatMap((chapter) =>
    chapter.questions.map((q) => ({
        ...q,
        chapterTitle: chapter.title,
        chapterId: chapter.id,
    }))
);

// --- NEW CUTE GIFS (High Reliability) ---
const GIFS = {
    // Cute waving bear for start
    start: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnZ4YXBoZ3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/LHZyixOnHwDDy/giphy.gif",
    // Writing/Thinking cat for middle
    mid: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/l4KibWpBGWchSqCRy/giphy.gif",
    // Hearts explosion for high progress
    high: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/26BRv0ThflsHCqDrG/giphy.gif",
    // Calculating computer
    calculating: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/3o7TKr3nzbh5WgCFxe/giphy.gif",
    // Final Celebration
    end: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5Z3V5Y3F5ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/TdfyKrN7HGTIY/giphy.gif"
};

// --- ANIMATION STYLES ---
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pop-in {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-float { animation: float 6s infinite ease-in-out; }
  .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
  .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
`;

export default function Create() {
    const navigate = useNavigate();
    const [docId, setDocId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [calculatingLove, setCalculatingLove] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        if (!loading && !calculatingLove && inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentIndex, loading, calculatingLove]);

    useEffect(() => {
        const init = async () => {
            let id = localStorage.getItem(DRAFT_KEY);
            if (id) {
                try {
                    const existing = await getLovePage(id);
                    if (existing && existing.status === "draft") {
                        setDocId(id);
                        const index = allQuestions.findIndex((q) => {
                            const path = q.field.split(".");
                            let value = existing;
                            for (let key of path) value = value?.[key];
                            return !value;
                        });
                        setCurrentIndex(index === -1 ? allQuestions.length : index);
                        setLoading(false);
                        return;
                    }
                } catch (e) { console.error(e); }
                localStorage.removeItem(DRAFT_KEY);
            }

            const newId = await createLovePage({
                creator: { name: "" },
                partner: { name: "", nickname: "" },
                answers: { realization: "", memory: "", smallThing: "", secret: "", admiration: "", fear: "", promise: "", chooseAgain: "", finalLine: "" },
            });
            localStorage.setItem(DRAFT_KEY, newId);
            setDocId(newId);
            setCurrentIndex(0);
            setLoading(false);
        };
        init();
    }, []);

    const handleNext = async () => {
        if (!answer.trim()) return;
        setIsSaving(true);
        await updateLovePage(docId, { [allQuestions[currentIndex].field]: answer });
        setIsSaving(false);

        if (currentIndex === allQuestions.length - 1) {
            setCalculatingLove(true);
            setTimeout(() => {
                setAnswer("");
                setCurrentIndex((prev) => prev + 1);
                setCalculatingLove(false);
            }, 3500);
        } else {
            setAnswer("");
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleNext();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-rose-400 gap-4">
                <div className="animate-spin w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full"/>
                <p className="text-sm font-bold tracking-widest uppercase animate-pulse">Brewing Love Potion...</p>
            </div>
        );
    }

    if (calculatingLove) {
        return (
            <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center text-center px-6 animate-pop-in">
                {/* Changed GIF to a reliable calculating one */}
                <img src={GIFS.calculating} alt="Calculating" className="w-48 h-48 mb-6 rounded-full shadow-xl border-4 border-white object-cover bg-rose-100" />
                <h2 className="text-3xl font-bold text-rose-600 mb-2">Analyzing Chemistry...</h2>
                <p className="text-slate-500">Compiling your cute answers...</p>
                <div className="w-64 h-2 bg-rose-200 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-rose-500 animate-[width_3s_ease-in-out_forwards]" style={{width: '0%'}}></div>
                </div>
                <style>{`@keyframes width { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
            </div>
        );
    }

    if (currentIndex >= allQuestions.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-100 flex flex-col items-center justify-center text-center px-6 animate-pop-in">
                <div className="relative">
                    <div className="absolute -inset-4 bg-white/50 rounded-full blur-xl animate-pulse"></div>
                    <img src={GIFS.end} alt="Done" className="relative w-40 h-40 mb-6 object-contain" />
                </div>

                <h2 className="text-4xl font-black text-rose-600 mb-2 drop-shadow-sm">Love Story Ready!</h2>
                <p className="text-slate-600 mb-8 max-w-xs mx-auto leading-relaxed">
                    We've packaged your feelings into something special.
                </p>

                <button
                    onClick={() => navigate(`/preview/${docId}`)}
                    className="px-8 py-4 bg-white text-rose-600 rounded-full font-bold shadow-[0_10px_30px_-10px_rgba(255,182,193,1)] hover:shadow-[0_20px_40px_-10px_rgba(255,182,193,1)] hover:-translate-y-1 transition-all border-2 border-rose-100"
                >
                    Preview My Masterpiece 👉
                </button>
            </div>
        );
    }

    const current = allQuestions[currentIndex];
    const progressPercent = ((currentIndex + 1) / allQuestions.length) * 100;

    // Logic to switch GIFs
    let currentGif = GIFS.start;
    if (progressPercent > 30) currentGif = GIFS.mid;
    if (progressPercent > 70) currentGif = GIFS.high;

    return (
        <div className="min-h-screen bg-[#FFF0F5] text-slate-800 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-hidden flex flex-col relative">
            <style>{animationStyles}</style>

            {/* --- CUTE BACKGROUND ELEMENTS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
                <div className="absolute top-10 left-10 text-4xl animate-float">💖</div>
                <div className="absolute bottom-20 right-10 text-5xl animate-float" style={{animationDelay: '1s'}}>💌</div>
                <div className="absolute top-1/2 left-20 text-3xl animate-bounce-slow" style={{animationDelay: '2s'}}>🌸</div>
                <div className="absolute top-20 right-1/3 text-2xl animate-float" style={{animationDelay: '3s'}}>✨</div>
            </div>

            {/* --- TOP BAR --- */}
            <header className="relative z-20 w-full max-w-2xl mx-auto pt-8 px-6 flex items-center justify-between">
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-white rounded-full text-sm font-bold text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all"
                >
                    ✕ Exit
                </button>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                            Love Meter
                        </span>
                        <span className="text-xs font-bold text-slate-600">{Math.round(progressPercent)}%</span>
                    </div>
                </div>
            </header>

            {/* --- MAIN CARD --- */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-2xl mx-auto w-full py-8">

                {/* Progress Bar */}
                <div className="w-full h-3 bg-white rounded-full mb-12 overflow-hidden shadow-inner border border-rose-100">
                    <div
                        className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500 ease-out relative"
                        style={{ width: `${progressPercent}%` }}
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                    </div>
                </div>

                {/* Question Card */}
                <div key={currentIndex} className="w-full bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(255,182,193,0.6)] border border-rose-50 animate-pop-in relative mt-8">

                    {/* Floating GIF Mascot - FIXED: Added bg color and reliable sizing */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 bg-rose-50 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden z-20">
                        <img
                            src={currentGif}
                            alt="Mascot"
                            className="w-full h-full object-cover scale-110"
                        />
                    </div>

                    <div className="mt-10 text-center">
                        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                            {current.chapterTitle}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-tight">
                            {current.label}
                        </h2>
                    </div>

                    {/* Input Area */}
                    <div className="relative group">
                        <textarea
                            ref={inputRef}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={current.placeholder || "Spill the tea... ☕️"}
                            className="w-full bg-rose-50/50 hover:bg-rose-50 focus:bg-white text-lg text-slate-700 placeholder:text-rose-300 border-2 border-rose-100 focus:border-rose-400 rounded-2xl px-6 py-6 outline-none resize-none min-h-[140px] transition-all duration-300"
                            autoFocus
                        />
                        <div className="absolute bottom-4 right-4 text-xs text-rose-300 font-bold pointer-events-none">
                            {answer.length > 0 ? "Perfect! ✨" : "Waiting..."}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-8">
                        <button
                            onClick={handleNext}
                            disabled={!answer.trim()}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform
                                ${!answer.trim()
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-rose-500 text-white hover:bg-rose-600 hover:-translate-y-1 shadow-lg shadow-rose-200'
                            }
                            `}
                        >
                            {isSaving ? "Saving..." : currentIndex === allQuestions.length - 1 ? "Finish! 🎉" : "Next Question 👉"}
                        </button>

                        <div className="text-center mt-4">
                            <span className="text-xs text-slate-400 font-medium">
                                Press <strong>Enter ↵</strong>
                            </span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}