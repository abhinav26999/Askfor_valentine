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

const HeartIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
);

const LockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const DRAFT_KEY = "love_draft_id";

// --- FLOATING HEARTS COMPONENT ---
const FloatingHearts = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute text-rose-200 animate-float opacity-50"
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
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default function Preview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);

    // INLINE EDIT STATE
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const doc = await getLovePage(id);
            setData(doc);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handlePublish = async () => {
        setPublishing(true);
        await publishLovePage(id);
        localStorage.removeItem(DRAFT_KEY);
        setTimeout(() => {
            navigate(`/love/${id}`);
        }, 2000);
    };

    const startEdit = (field, value) => {
        setEditingField(field);
        setTempValue(value || "");
    };

    const cancelEdit = () => {
        setEditingField(null);
        setTempValue("");
    };

    const saveEdit = async (field) => {
        setSaving(true);
        await updateLovePage(id, { [field]: tempValue });

        setData(prev => {
            const keys = field.split(".");
            if (keys.length === 1) return { ...prev, [keys[0]]: tempValue };
            if (keys.length === 2) return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: tempValue } };
            return prev;
        });

        setSaving(false);
        cancelEdit();
    };

    if (loading) return (
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-rose-400 gap-4">
            <div className="animate-spin w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full"/>
            <p className="text-sm font-medium tracking-widest uppercase animate-pulse">Opening your book...</p>
        </div>
    );

    if (!data) return <div className="min-h-screen bg-pink-50 flex items-center justify-center text-slate-500">Story not found.</div>;

    // --- PUBLISHING OVERLAY (Light Theme) ---
    if (publishing) {
        return (
            <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center px-6">
                <div className="relative z-10">
                    <img
                        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGIwZHIxNnBwbHh5ZWF4cm45czh6ZGd6Znd6cm56Z3I4Z3I4Z3I4ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/LpDmM2wSt6Hm5fKJVa/giphy.gif"
                        alt="Sending love"
                        className="w-32 h-32 mx-auto mb-6"
                    />
                    <h2 className="text-4xl font-serif text-rose-600 mb-4">Sealing with a kiss...</h2>
                    <p className="text-slate-500">Creating your permanent secret link.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF0F5] text-slate-800 font-sans selection:bg-rose-200 selection:text-rose-900 pb-32">

            <FloatingHearts />

            {/* --- NAVBAR (Light) --- */}
            <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
                        <span className="text-2xl group-hover:scale-110 transition-transform">💌</span>
                        <span className="font-serif text-xl font-bold tracking-tight text-slate-800">
                            AskFor<span className="text-rose-500">Love</span>
                        </span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32">

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-rose-200 text-rose-500 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                            Final Preview
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-[1.1]">
                            Ready to send to <br/>
                            <span className="text-rose-500 italic relative">
                                {data.partner?.name || "Partner"}?
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-rose-300 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                            </span>
                        </h1>
                    </div>

                    {/* Cute GIF Sticker */}
                    <div className="hidden md:block">
                        <img
                            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWEzb3VxamgzODN0aWNzNjY0YzE4ZXM2bWw2dnNpZXpzcTBuZTlzbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KjvlWLTmKqAww/giphy.gif"
                            alt="Love letter"
                            className="w-32 h-32 opacity-90 hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* CHAPTER CARDS (Paper Look) */}
                <div className="grid md:grid-cols-2 gap-8">
                    {creatorChapters.map((chapter, i) => (
                        <div
                            key={chapter.id}
                            className={`
                                relative bg-white rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-rose-50 hover:shadow-[0_20px_40px_-15px_rgba(255,182,193,0.4)] transition-all duration-300
                                ${i === creatorChapters.length - 1 ? 'md:col-span-2' : ''}
                            `}
                        >
                            {/* Decorative Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-rose-100/50 rotate-[-2deg] backdrop-blur-sm"></div>

                            <h2 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-[10px]">
                                    {i + 1}
                                </span>
                                {chapter.title}
                            </h2>

                            <div className="space-y-12">
                                {chapter.questions.map((q) => {
                                    // Logic to read nested data
                                    const path = q.field.split(".");
                                    let value = data;
                                    for (let key of path) value = value?.[key];

                                    return (
                                        <div key={q.field} className="group">
                                            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">{q.label}</p>

                                            {editingField === q.field ? (
                                                <div className="space-y-4 bg-rose-50/50 p-4 rounded-xl">
                                                  <textarea
                                                      value={tempValue}
                                                      onChange={(e) => setTempValue(e.target.value)}
                                                      rows={3}
                                                      className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none shadow-inner"
                                                      autoFocus
                                                  />

                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => saveEdit(q.field)}
                                                            className="px-5 py-2 rounded-full bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition shadow-lg shadow-rose-200"
                                                        >
                                                            {saving ? "Saving..." : "Save Changes"}
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="px-5 py-2 rounded-full bg-white text-slate-500 border border-slate-200 text-sm font-medium hover:bg-slate-50 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start justify-between gap-6">
                                                    <div className="flex-1">
                                                        <p className={`font-serif text-slate-800 leading-relaxed ${value?.length > 50 ? 'text-lg' : 'text-xl'}`}>
                                                            {value || <span className="text-slate-300 italic">Not answered yet...</span>}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => startEdit(q.field, value)}
                                                        className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 hover:scale-110"
                                                        title="Edit this answer"
                                                    >
                                                        <EditIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FLOATING ACTION BAR (Light) --- */}
            <div className="fixed bottom-0 left-0 w-full z-40">
                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />

                <div className="relative max-w-4xl mx-auto px-6 pb-10 flex items-center justify-center md:justify-end gap-6">
                    <div className="hidden md:block text-right">
                        <p className="text-slate-800 font-bold">Ready to send?</p>
                        <p className="text-slate-400 text-xs">Create your secret link now</p>
                    </div>

                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className="group relative px-10 py-4 bg-slate-900 rounded-full text-white font-bold tracking-wide shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center gap-3">
                            <span>Publish Story</span>
                            <span className="text-xl group-hover:animate-bounce">💌</span>
                        </span>
                    </button>
                </div>
            </div>

        </div>
    );
}