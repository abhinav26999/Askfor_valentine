import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLovePage, publishLovePage, updateLovePage } from "../firebase/loveService";
import { creatorChapters } from "../data/creatorChapters";

// --- ICONS ---
const EditIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const DRAFT_KEY = "love_draft_id";

// --- FLOATING HEARTS BACKGROUND ---
const FloatingHearts = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
            <div
                key={i}
                className="absolute text-rose-200 animate-float opacity-50 select-none"
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
                50% { transform: translateY(-20px) rotate(10deg); }
            }
            .animate-float { animation: float 6s infinite ease-in-out; }
        `}</style>
    </div>
);

export default function Preview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);

    // UI States
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("direct"); // "direct" or "wait"
    const [isPublished, setIsPublished] = useState(false); // Track if published to show link options

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doc = await getLovePage(id);
                if (doc) {
                    setData(doc);
                    if (doc.status === 'published') setIsPublished(true);
                }
            } catch (error) {
                console.error("Failed to load page", error);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handlePublish = async () => {
        setPublishing(true);
        await publishLovePage(id);
        localStorage.removeItem(DRAFT_KEY);
        setPublishing(false);
        setIsPublished(true);
    };

    const copyLink = (type) => {
        const baseUrl = window.location.origin;
        const path = type === 'wait' ? `/wait/${id}` : `/love/${id}`;
        const url = `${baseUrl}${path}`;
        navigator.clipboard.writeText(url).then(() => {
            alert(type === 'wait' ? "Countdown Link Copied! ⏳ Send this if you want them to wait." : "Direct Link Copied! 💌 Send this to open now.");
        });
    };

    const startEdit = (field, value) => {
        setEditingField(field);
        setTempValue(value || "");
    };

    const saveEdit = async (field) => {
        setSaving(true);
        await updateLovePage(id, { [field]: tempValue });

        setData(prev => {
            const newData = { ...prev };
            const keys = field.split(".");
            if (keys.length === 1) newData[keys[0]] = tempValue;
            if (keys.length === 2) newData[keys[0]][keys[1]] = tempValue;
            return newData;
        });

        setSaving(false);
        setEditingField(null);
    };

    if (loading) return (
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-rose-400 gap-4">
            <div className="animate-spin w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full"/>
            <p className="text-sm font-medium tracking-widest uppercase animate-pulse">Opening your book...</p>
        </div>
    );

    if (!data) return <div className="min-h-screen bg-pink-50 flex items-center justify-center text-slate-500">Story not found.</div>;

    return (
        <div className="min-h-screen bg-[#FFF0F5] text-slate-800 font-sans selection:bg-rose-200 selection:text-rose-900 pb-40">
            <FloatingHearts />

            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
                        <span className="text-2xl group-hover:scale-110 transition-transform">💌</span>
                        <span className="font-serif text-xl font-bold tracking-tight text-slate-800">
                            AskFor<span className="text-rose-500">Love</span>
                        </span>
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-rose-200 text-rose-500 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                            {isPublished ? "Published & Live" : "Final Preview"}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-[1.1]">
                            Ready to send to <br/>
                            <span className="text-rose-500 italic relative inline-block">
                                {data.partner?.name || "Partner"}?
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-rose-300 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                            </span>
                        </h1>
                    </div>
                    {/* Sticker */}
                    <div className="hidden md:block animate-float">
                        <img
                            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWEzb3VxamgzODN0aWNzNjY0YzE4ZXM2bWw2dnNpZXpzcTBuZTlzbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KjvlWLTmKqAww/giphy.gif"
                            alt="Love letter"
                            className="w-32 h-32 opacity-90"
                        />
                    </div>
                </div>

                {/* Content Cards */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {creatorChapters.map((chapter, i) => (
                        <div key={chapter.id} className={`relative bg-white rounded-3xl p-8 shadow-sm border border-rose-50 hover:shadow-md transition-all duration-300 ${i === creatorChapters.length - 1 ? 'md:col-span-2' : ''}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-rose-100/50 rotate-[-2deg] backdrop-blur-sm"></div>

                            <h2 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-[10px]">{i + 1}</span>
                                {chapter.title}
                            </h2>

                            <div className="space-y-8">
                                {chapter.questions.map((q) => {
                                    const path = q.field.split(".");
                                    let value = data;
                                    for (let key of path) value = value?.[key];

                                    return (
                                        <div key={q.field} className="group">
                                            <p className="text-[10px] md:text-xs text-slate-400 mb-2 font-bold uppercase tracking-wide">{q.label}</p>

                                            {editingField === q.field ? (
                                                <div className="bg-rose-50 p-3 rounded-xl animate-in fade-in zoom-in duration-200">
                                                    <textarea
                                                        value={tempValue}
                                                        onChange={(e) => setTempValue(e.target.value)}
                                                        rows={3}
                                                        className="w-full bg-white border border-rose-200 rounded-lg p-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-2 mt-3 justify-end">
                                                        <button onClick={() => setEditingField(null)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-white transition">Cancel</button>
                                                        <button onClick={() => saveEdit(q.field)} className="px-4 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold shadow-md hover:bg-rose-600 transition">{saving ? "..." : "Save"}</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start justify-between gap-4">
                                                    <p className="font-serif text-lg md:text-xl text-slate-800 leading-relaxed">
                                                        {value || <span className="text-slate-300 italic text-sm">Not answered</span>}
                                                    </p>
                                                    {!isPublished && (
                                                        <button
                                                            onClick={() => startEdit(q.field, value)}
                                                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                                                        >
                                                            <EditIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- MEMORIES PREVIEW SECTION (NEW) --- */}
                {data.memories && data.memories.length > 0 && (
                    <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-rose-50 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-rose-100/50 rotate-[2deg] backdrop-blur-sm"></div>
                        <h2 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-[10px]">5</span>
                            The Memories
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data.memories.map((url, index) => (
                                <div key={index} className="aspect-square rounded-xl overflow-hidden border border-rose-100 shadow-sm relative group transform hover:scale-105 transition-all">
                                    <img src={url} alt={`Memory ${index}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* --- BOTTOM ACTION BAR --- */}
            <div className="fixed bottom-0 left-0 w-full z-50">
                {/* Gradient fade for content underneath */}
                <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#FFF0F5] via-[#FFF0F5]/90 to-transparent pointer-events-none" />

                <div className="relative bg-white border-t border-rose-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl p-6 md:p-8 max-w-2xl mx-auto mb-0 md:mb-6 md:rounded-3xl md:shadow-2xl md:border transition-all duration-500">

                    {!isPublished ? (
                        // STATE 1: PRE-PUBLISH
                        <div className="flex items-center justify-between gap-4">
                            <div className="hidden md:block">
                                <p className="font-bold text-slate-800">Everything looks good?</p>
                                <p className="text-xs text-slate-400">Once published, you can share it.</p>
                            </div>
                            <button
                                onClick={handlePublish}
                                disabled={publishing}
                                className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {publishing ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : (
                                    <>
                                        <span>Publish Story</span>
                                        <span>🚀</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        // STATE 2: POST-PUBLISH (SHARE OPTIONS)
                        <div className="animate-in slide-in-from-bottom duration-500">
                            <h3 className="text-center text-slate-800 font-bold mb-4 flex items-center justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                                Ready to Share! Choose a style:
                            </h3>

                            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mb-6">
                                <button
                                    onClick={() => setActiveTab("direct")}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "direct" ? "bg-white shadow text-rose-500" : "text-slate-400 hover:text-slate-600"}`}
                                >
                                    Open Now 💌
                                </button>
                                <button
                                    onClick={() => setActiveTab("wait")}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "wait" ? "bg-white shadow text-rose-500" : "text-slate-400 hover:text-slate-600"}`}
                                >
                                    Countdown ⏳
                                </button>
                            </div>

                            <button
                                onClick={() => copyLink(activeTab)}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2
                                    ${activeTab === 'direct' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-300'}
                                `}
                            >
                                <span>{activeTab === 'direct' ? "Copy Direct Link" : "Copy Timer Link"}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                </svg>
                            </button>

                            <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                                {activeTab === 'wait' ? "Link stays locked until Feb 14th." : "Link opens immediately."}
                            </p>
                        </div>
                    )}
                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                        <p className="text-[10px] text-slate-400 leading-relaxed max-w-sm mx-auto">
                            <span className="font-bold text-slate-500">🔒 Privacy Notice:</span> Don't worry! Your images are
                            not permanently stored. A backend script automatically deletes them from our database after the
                            link is generated to ensure your privacy.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}