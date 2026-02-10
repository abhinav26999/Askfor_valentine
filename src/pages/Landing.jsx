import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- ICONS ---
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

const LockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const MagicWandIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
);

// --- ANIMATION STYLES ---
const styles = `
    @keyframes float-slow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(225, 29, 72, 0.5); transform: scale(1); }
        50% { box-shadow: 0 0 40px rgba(225, 29, 72, 0.8); transform: scale(1.05); }
    }
    @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 3s infinite; }
    .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
`;

export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-rose-500/30 overflow-x-hidden relative">
            <style>{styles}</style>

            {/* --- ALIVE BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Moving Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-[120px] animate-float-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '2s' }} />

                {/* Star Field Effect */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
            </div>

            {/* --- NAVBAR --- */}
            <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'bg-slate-900/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-rose-500 blur-lg opacity-50 group-hover:opacity-100 transition duration-500" />
                            <HeartIcon className="w-8 h-8 text-rose-500 relative z-10 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="font-serif text-2xl font-bold tracking-tight text-white">
                            AskFor<span className="text-rose-500">Love</span>
                        </span>
                    </div>

                    <button
                        onClick={() => navigate("/create")}
                        className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-rose-500/50 transition-all group"
                    >
                        <span className="text-sm font-medium">Create Story</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </nav>

            <div className="relative z-10">

                {/* --- HERO SECTION --- */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-rose-300 text-sm mb-8 animate-fade-in-up backdrop-blur-sm">
                        <SparkleIcon className="w-4 h-4 text-yellow-300" />
                        <span className="tracking-wide">The new way to say "I Love You"</span>
                    </div>

                    {/* Headline */}
                    <h1 className="max-w-5xl mx-auto font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight text-white mb-8 animate-fade-in-up delay-100">
                        Turn your feelings into a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-indigo-400 relative">
                            digital experience.
                            {/* Underline decoration */}
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-rose-500 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed mb-12 animate-fade-in-up delay-200">
                        Don't just send a text. Create a private, interactive webpage that tells your unique story.
                        Encrypted, personal, and unforgettable.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
                        <button
                            onClick={() => navigate("/create")}
                            className="relative group px-10 py-5 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full text-white text-lg font-bold tracking-wide shadow-[0_0_40px_-10px_rgba(225,29,72,0.5)] hover:shadow-[0_0_60px_-10px_rgba(225,29,72,0.7)] hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center gap-2">
                                Start Writing Now
                                <MagicWandIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </span>
                        </button>

                        <a
                            href="/love/demo"
                            className="flex items-center gap-2 px-10 py-5 rounded-full text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 transition-all"
                        >
                            View Live Demo
                        </a>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* --- FEATURES GRID (Glass Cards) --- */}
                <section className="py-32 px-6 relative">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">Why create an AskForLove page?</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: LockIcon,
                                    color: "text-blue-400",
                                    bg: "bg-blue-500/10",
                                    title: "Private & Encrypted",
                                    desc: "No public feeds. Your story creates a unique link accessible only to the person you share it with."
                                },
                                {
                                    icon: HeartIcon,
                                    color: "text-rose-400",
                                    bg: "bg-rose-500/10",
                                    title: "Interactive Emotion",
                                    desc: "Beyond text. Use animations, music, and interactive buttons to make them feel something real."
                                },
                                {
                                    icon: SparkleIcon,
                                    color: "text-yellow-400",
                                    bg: "bg-yellow-500/10",
                                    title: "Zero Friction",
                                    desc: "No apps to download. It works instantly in their browser on any device (iOS & Android)."
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 hover:-translate-y-2">
                                    <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- HOW IT WORKS (Horizontal Timeline) --- */}
                <section className="py-32 bg-slate-900/50 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <span className="text-rose-500 font-bold tracking-widest uppercase text-sm">Simple Process</span>
                            <h2 className="text-3xl md:text-5xl font-serif mt-4 text-white">From heart to screen in minutes</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0"></div>

                            {[
                                { step: "01", title: "Answer Questions", desc: "We ask you deep questions to help you articulate your feelings." },
                                { step: "02", title: "Review & Polish", desc: "See a live preview of your story. Edit until it's perfect." },
                                { step: "03", title: "Send the Link", desc: "Get a private URL. Send it when the moment feels right." }
                            ].map((item, i) => (
                                <div key={i} className="relative text-center group">
                                    <div className="w-24 h-24 mx-auto bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center relative z-10 group-hover:border-rose-500 transition-colors duration-300">
                                        <span className="text-3xl font-serif font-bold text-white">{item.step}</span>
                                    </div>
                                    <h3 className="mt-8 text-xl font-bold text-white">{item.title}</h3>
                                    <p className="mt-4 text-slate-400 px-4">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- BIG CTA --- */}
                <section className="py-40 px-6 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-600/20 to-indigo-600/20 rounded-full blur-[100px] animate-pulse-glow" />

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
                            Ready to make their day?
                        </h2>
                        <p className="text-xl text-slate-400 mb-12">
                            It takes less than 5 minutes to create a memory that lasts forever.
                        </p>
                        <button
                            onClick={() => navigate("/create")}
                            className="px-12 py-6 bg-white text-slate-900 rounded-full text-lg font-bold hover:bg-slate-200 transition-colors shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] hover:scale-105 transform duration-200"
                        >
                            Create Your Story
                        </button>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="border-t border-white/5 py-12 text-center bg-slate-950">
                    <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
                        <HeartIcon className="w-6 h-6 text-rose-600" />
                    </div>
                    <p className="text-slate-500 text-sm">© 2026 AskForLove. Made with ❤️ for meaningful moments.</p>
                </footer>

            </div>
        </div>
    );
}