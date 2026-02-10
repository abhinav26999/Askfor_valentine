import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLovePage } from "../firebase/loveService";

export default function Gallery() {
    const { id } = useParams();
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const data = await getLovePage(id);
                // Check if the user uploaded images
                if (data && data.memories && data.memories.length > 0) {
                    const formatted = data.memories.map((url, i) => ({
                        id: i,
                        src: url,
                        type: 'img',
                        caption: `Memory ${i + 1}`,
                        // Random rotation and position to simulate scattered photos
                        rot: `${Math.random() * 20 - 10}deg`,
                        top: `${Math.random() * 50 + 10}%`,
                        left: `${Math.random() * 60 + 5}%`
                    }));
                    setMemories(formatted);
                } else {
                    // Fallback note if no images exist
                    setMemories([
                        {
                            id: 99,
                            type: 'note',
                            text: "No photos found... but the love is real.",
                            caption: "Note",
                            rot: '5deg',
                            top: '40%',
                            left: '40%'
                        }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching gallery:", error);
            }
            setLoading(false);
        };
        fetchMemories();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#f3f0e9] flex items-center justify-center font-serif text-slate-400">
            <span className="animate-pulse">Opening Memory Box...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f3f0e9] overflow-hidden relative cursor-grab active:cursor-grabbing">

            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>

            {/* Header */}
            <h1 className="absolute top-10 left-0 w-full text-center font-serif text-4xl text-slate-800 opacity-40 z-0 tracking-widest uppercase">
                Our Memories
            </h1>

            {/* Draggable/Hoverable Photos */}
            {memories.map((mem) => (
                <div
                    key={mem.id}
                    onMouseEnter={() => setActiveId(mem.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className={`
                        absolute p-3 bg-white shadow-xl transition-all duration-500 ease-out border border-gray-200
                        ${activeId === mem.id ? 'z-50 scale-110 shadow-2xl rotate-0' : 'z-10 scale-100 grayscale-[10%]'}
                    `}
                    style={{
                        top: mem.top,
                        left: mem.left,
                        transform: activeId === mem.id ? 'scale(1.1)' : `rotate(${mem.rot})`,
                        width: '260px',
                    }}
                >
                    {/* Tape Effect */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-rose-200/50 rotate-1 backdrop-blur-sm shadow-sm"></div>

                    {mem.type === 'img' ? (
                        <div className="w-full aspect-square overflow-hidden mb-3 bg-gray-100">
                            <img src={mem.src} alt="" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-full aspect-square flex items-center justify-center p-4 bg-yellow-50 text-center font-serif text-xl italic text-slate-600">
                            "{mem.text}"
                        </div>
                    )}

                    <p className="font-mono text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                        {mem.caption}
                    </p>
                </div>
            ))}

            {/* --- PRIVACY FOOTER --- */}
            <div className="fixed bottom-0 left-0 w-full text-center z-40 pointer-events-none p-4">
                <p className="text-sm text-slate-400/80 bg-white/60 backdrop-blur-sm inline-block px-6 py-2 rounded-full shadow-sm border border-white/20">
                    🔒 <strong>Privacy Notice:</strong> Don't worry! Your images are not permanently stored.
                    A backend script automatically deletes them from our database after the link is generated to ensure your privacy.
                </p>
            </div>
        </div>
    );
}