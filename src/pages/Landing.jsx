import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoryCount } from "../firebase/loveService";

// --- ICONS (Themed for Soft Aesthetic) ---
const HeartIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
);

const SparkleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

// --- FLOATING HEARTS BACKGROUND (Identical to Preview) ---
const FloatingHearts = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
            <div
                key={i}
                className="absolute text-rose-200 animate-float opacity-40 select-none"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    fontSize: `${Math.random() * 20 + 20}px`
                }}
            >
                ❤️
            </div>
        ))}
        <style>{`
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0); }
                50% { transform: translateY(-30px) rotate(15deg); }
            }
            .animate-float { animation: float 7s infinite ease-in-out; }
            @keyframes fade-in-up {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        `}</style>
    </div>
);

export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        getStoryCount().then(val => setCount(val));
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#FFF0F5] text-slate-800 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden relative">
            <FloatingHearts />

            {/* --- NAVBAR --- */}
            <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-rose-100 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
                        <span className="text-2xl group-hover:scale-110 transition-transform">💌</span>
                        <span className="font-serif text-2xl font-bold tracking-tight text-slate-800">
                            AskFor<span className="text-rose-500">Love</span>
                        </span>
                    </div>
                </div>
            </nav>

            <div className="relative z-10">

                {/* --- HERO SECTION --- */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
                    {/* LIVE COUNTER BADGE */}
                    <div className="mb-8 flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-md border border-rose-200 rounded-full animate-fade-in-up shadow-sm">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                        <span className="text-xs font-bold text-rose-500 tracking-widest uppercase">
                            {count > 0 ? count.toLocaleString() : "..."} Stories Created
                        </span>
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/50 border border-rose-200 text-rose-600 text-sm mb-8 animate-fade-in-up backdrop-blur-sm">
                        <SparkleIcon className="w-4 h-4" />
                        <span className="font-medium tracking-wide italic">The new way to say "I Love You"</span>
                    </div>

                    {/* Headline */}
                    <h1 className="max-w-5xl mx-auto font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight text-slate-900 mb-8 animate-fade-in-up">
                        Turn your feelings into a <br />
                        <span className="text-rose-500 italic relative inline-block">
                            digital experience.
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-rose-300 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed mb-12 animate-fade-in-up">
                        Don't just send a text. Create a private, interactive webpage that tells your unique story.
                        Personal, aesthetic, and unforgettable.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up">
                        <button
                            onClick={() => navigate("/create")}
                            className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-lg font-bold tracking-wide shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
                        >
                            Start Writing Your Story
                        </button>


                    </div>
                </section>

                {/* --- FEATURES GRID --- */}
                <section className="py-32 px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-slate-900">Why a digital love letter?</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: "🔒",
                                    title: "Private & Secure",
                                    desc: "No public feeds. Your story creates a unique link accessible only to the person you share it with."
                                },
                                {
                                    icon: "💝",
                                    title: "Interactive Emotion",
                                    desc: "Beyond text. Use your memories and interactive elements to make them feel something real."
                                },
                                {
                                    icon: "✨",
                                    title: "Zero Friction",
                                    desc: "No apps to download. It works instantly in their browser on any device (iOS & Android)."
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="group p-8 rounded-3xl bg-white border border-rose-50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2">
                                    <div className="text-4xl mb-6">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- HOW IT WORKS (Horizontal Timeline) --- */}
                <section className="py-32 bg-white/50 border-y border-rose-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <span className="text-rose-500 font-bold tracking-widest uppercase text-xs">Simple Process</span>
                            <h2 className="text-3xl md:text-5xl font-serif mt-4 text-slate-900">From heart to screen in minutes</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-rose-200"></div>

                            {[
                                { step: "01", title: "Answer Questions", desc: "We ask you deep questions to help you articulate your feelings." },
                                { step: "02", title: "Review & Polish", desc: "See a live preview of your story. Edit until it's perfect." },
                                { step: "03", title: "Send the Link", desc: "Get a private URL. Send it when the moment feels right." }
                            ].map((item, i) => (
                                <div key={i} className="relative text-center group">
                                    <div className="w-24 h-24 mx-auto bg-white border-4 border-rose-100 rounded-full flex items-center justify-center relative z-10 group-hover:border-rose-400 transition-colors duration-300">
                                        <span className="text-3xl font-serif font-bold text-rose-500">{item.step}</span>
                                    </div>
                                    <h3 className="mt-8 text-xl font-bold text-slate-900 font-serif">{item.title}</h3>
                                    <p className="mt-4 text-slate-500 px-4">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- BIG CTA --- */}
                <section className="py-40 px-6 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight">
                            Ready to make <br/> their day?
                        </h2>
                        <p className="text-xl text-slate-500 mb-12">
                            It takes less than 5 minutes to create a memory that lasts forever.
                        </p>
                        <button
                            onClick={() => navigate("/create")}
                            className="px-12 py-6 bg-rose-500 text-white rounded-2xl text-lg font-bold hover:bg-rose-600 transition-all shadow-xl hover:scale-105 transform duration-200"
                        >
                            Create Your Story Now
                        </button>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="border-t border-rose-100 py-16 text-center bg-white/50">
                    <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
                        <HeartIcon className="w-6 h-6 text-rose-500" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">© 2026 AskForLove. Made for meaningful moments.</p>
                    <div className="max-w-2xl mx-auto px-6 pt-6 mt-6 border-t border-rose-50">
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                            🔒 <strong>Privacy Notice:</strong> Your memories are private. Our system automatically cleanses
                            media data periodically after link generation to ensure your story stays between the two of you.
                        </p>
                    </div>
                </footer>

            </div>
        </div>
    );
}