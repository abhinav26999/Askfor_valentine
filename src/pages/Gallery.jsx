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
            const data = await getLovePage(id);
            // Default to some placeholders if no images uploaded
            if (data?.memories && data.memories.length > 0) {
                // Map the simple URL array to object structure for the gallery layout
                const formatted = data.memories.map((url, i) => ({
                    id: i,
                    src: url,
                    caption: "Memory " + (i + 1),
                    rot: `${Math.random() * 10 - 5}deg`, // Random rotation
                    top: `${Math.random() * 40 + 10}%`,   // Random position
                    left: `${Math.random() * 60 + 10}%`
                }));
                setMemories(formatted);
            } else {
                setMemories([]); // Or leave empty
            }
            setLoading(false);
        };
        fetchMemories();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#f3f0e9] flex items-center justify-center">Loading Memories...</div>;

    if (memories.length === 0) {
        return (
            <div className="min-h-screen bg-[#f3f0e9] flex items-center justify-center text-center p-6">
                <h1 className="text-3xl font-serif text-slate-400">No photos were uploaded... but the memories are in your heart. ❤️</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f0e9] overflow-hidden relative cursor-grab active:cursor-grabbing">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>

            <h1 className="absolute top-10 left-0 w-full text-center font-serif text-3xl md:text-5xl text-slate-800 opacity-30 z-0 tracking-widest font-black uppercase">
                Memory Lane
            </h1>

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
                        width: '250px',
                    }}
                >
                    {/* TAPE EFFECT */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-200/40 rotate-1 backdrop-blur-sm shadow-sm"></div>

                    <div className="w-full aspect-square overflow-hidden mb-4 bg-gray-100">
                        <img src={mem.src} alt="" className="w-full h-full object-cover" />
                    </div>
                </div>
            ))}
        </div>
    );
}