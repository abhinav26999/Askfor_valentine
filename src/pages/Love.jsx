import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { getLovePage } from "../firebase/loveService";
import confetti from "canvas-confetti";

// --- BOLD ICONS ---
const Icons = {
    Heart: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>,
    Star: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>,
    Bolt: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" /></svg>,
    Lock: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>,
    Eye: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" /></svg>
};

// --- DEMO DATA ---
const DEMO_DATA = {
    creator: { name: "Alex" },
    partner: { name: "Sam", nickname: "Sammy" },
    answers: {
        realization: "It was that rainy Tuesday when you brought soup to my apartment without me asking. I knew then.",
        memory: "Driving down the coast with the windows down, singing terribly to 80s music.",
        smallThing: "How you always leave the last bite of dessert for me.",
        secret: "I was actually incredibly nervous on our first date, even though I acted cool.",
        admiration: "Your absolute kindness to strangers. You make the world softer.",
        promise: "To always be your biggest fan, even when things are tough.",
        finalLine: "You are my favorite adventure.",
    },
};

// --- STORY GENERATOR ---
const parseStory = (data) => {
    if (!data) return [];
    const { creator, partner, answers } = data;

    return [
        {
            bg: "bg-yellow-400", textCol: "text-black",
            icon: Icons.Eye,
            title: "Wait...",
            text: "I need to tell you something.",
            sub: "(Tap to pull the page)"
        },
        {
            bg: "bg-rose-600", textCol: "text-white",
            icon: Icons.Star,
            title: `Hey ${partner.nickname || partner.name}`,
            text: "You better sit down for this.",
            sub: "Keep going..."
        },
        {
            bg: "bg-black", textCol: "text-white",
            icon: Icons.Bolt,
            title: "The Realization",
            question: "The exact moment I knew I was in trouble...",
            answer: answers.realization
        },
        {
            bg: "bg-blue-600", textCol: "text-white",
            icon: Icons.Star,
            title: "Core Memory",
            question: "I will never delete this from my brain:",
            answer: answers.memory
        },
        {
            bg: "bg-purple-600", textCol: "text-white",
            icon: Icons.Heart,
            title: "The Little Things",
            question: "You probably don't even know you do this:",
            answer: answers.smallThing
        },
        {
            bg: "bg-slate-900", textCol: "text-yellow-400",
            icon: Icons.Lock,
            title: "Confession Time",
            question: "I've never told anyone this...",
            answer: answers.secret
        },
        {
            bg: "bg-white", textCol: "text-black",
            icon: Icons.Heart,
            title: "Why You?",
            question: "Because...",
            answer: answers.admiration
        },
        {
            bg: "bg-rose-500", textCol: "text-white",
            icon: Icons.Bolt,
            title: "My Promise",
            question: "I swear to you:",
            answer: answers.promise
        },
        {
            bg: "bg-yellow-400", textCol: "text-black",
            type: "valentine",
            question: "SO...",
            sub: "Will you be my Valentine?"
        }
    ];
};

export default function Love() {
    const { id } = useParams();
    const navigate = useNavigate(); // FIXED: Initialized hook
    const [data, setData] = useState(null);
    const [slides, setSlides] = useState([]);
    const [removedSlides, setRemovedSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [noBtnPos, setNoBtnPos] = useState({ top: "60%", left: "20%" });

    useEffect(() => {
        const init = async () => {
            let doc = id === 'demo' ? DEMO_DATA : await getLovePage(id);
            if (doc) {
                setData(doc);
                setSlides(parseStory(doc));
            }
            setLoading(false);
        };
        init();
    }, [id]);

    const handlePull = () => {
        if (!accepted && removedSlides.length < slides.length - 1) {
            setRemovedSlides([...removedSlides, removedSlides.length]);
        }
    };

    const handleYes = () => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FF0000', '#FFFFFF', '#FF69B4']
        });
        setAccepted(true);
    };

    const moveNoButton = (e) => {
        e.stopPropagation();
        const x = Math.random() * 60 + 20;
        const y = Math.random() * 60 + 20;
        setNoBtnPos({ top: `${y}%`, left: `${x}%` });
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-black text-3xl">LOADING...</div>;
    if (!data) return <div>Story not found.</div>;

    // --- SUCCESS STATE (THE LOVE THEME) ---
    if (accepted) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-600 text-white p-6 text-center animate-in fade-in duration-1000">

                {/* Floating Background Hearts */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-10 left-10 text-9xl animate-pulse">❤️</div>
                    <div className="absolute bottom-10 right-10 text-9xl animate-pulse">❤️</div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center h-full justify-center">
                    <div className="w-24 h-24 mb-6 text-white animate-bounce">
                        <Icons.Heart />
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-tight drop-shadow-xl">
                        I LOVE YOU<br/>
                        <span className="text-black bg-white px-4 transform -rotate-2 inline-block mt-2 rounded-lg">
                            {data.partner.name || "Partner"}!
                        </span>
                    </h1>

                    <div className="inline-block border-4 border-white rounded-full px-8 py-3 text-lg font-bold uppercase tracking-widest bg-white/10 backdrop-blur-sm mb-16">
                        Forever & Always
                    </div>

                    {/* --- MEMORIES BUTTON (FIXED) --- */}
                    <button
                        onClick={() => navigate(`/gallery/${id}`)}
                        className="group relative px-10 py-5 bg-white text-rose-600 rounded-full text-xl font-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden animate-pulse"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            See Our Memories
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    // --- SLIDESHOW STATE (Previous code remains same for pulling animation) ---
    return (
        <div className="relative min-h-screen w-full bg-black overflow-hidden font-sans cursor-pointer select-none" onClick={handlePull}>
            {slides.map((slide, index) => {
                const isRemoved = removedSlides.includes(index);
                const isValentine = slide.type === 'valentine';
                const zIndex = slides.length - index;

                return (
                    <div
                        key={index}
                        className={`
                            absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 transition-transform duration-700 ease-in-out
                            ${slide.bg} ${slide.textCol}
                            ${isRemoved ? 'translate-x-[150%] rotate-12' : 'translate-x-0 rotate-0'}
                        `}
                        style={{ zIndex: zIndex }}
                    >
                        {!isValentine ? (
                            <div className="max-w-xl text-center">
                                <div className={`w-32 h-32 mx-auto mb-12 ${slide.textCol === 'text-white' ? 'opacity-90' : 'text-black opacity-80'}`}>
                                    {slide.icon && <slide.icon />}
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                                    {slide.title}
                                </h1>
                                {slide.question && <p className="text-xl font-bold opacity-60 uppercase tracking-widest mb-6">{slide.question}</p>}
                                <p className="text-3xl md:text-5xl font-bold leading-tight">{slide.text || `"${slide.answer}"`}</p>
                                {slide.sub && <div className="absolute bottom-12 left-0 w-full text-center animate-pulse"><p className="text-sm font-black uppercase tracking-[0.3em] opacity-50">{slide.sub}</p></div>}
                            </div>
                        ) : (
                            <div className="max-w-2xl text-center relative w-full h-full flex flex-col items-center justify-center">
                                <h1 className="text-7xl md:text-9xl font-black mb-4 leading-none tracking-tighter">BE MY<br/>VALENTINE?</h1>
                                <p className="text-2xl font-bold mb-16 opacity-70">Don't break my heart.</p>
                                <div className="relative w-full h-40">
                                    <button onClick={(e) => { e.stopPropagation(); handleYes(); }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-12 py-6 rounded-full text-3xl font-black hover:scale-110 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">YES</button>
                                    <button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} onClick={(e) => e.stopPropagation()} style={{ top: noBtnPos.top, left: noBtnPos.left }} className="absolute bg-white text-black border-4 border-black px-6 py-3 rounded-full text-lg font-bold transition-all duration-200">No</button>
                                </div>
                            </div>
                        )}
                        <div className="absolute right-0 top-0 h-full w-4 bg-black/10"></div>
                    </div>
                );
            })}
        </div>
    );
}