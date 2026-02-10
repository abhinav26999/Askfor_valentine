import React, { useState } from "react";

// Placeholder photos
const MEMORIES = [
    { id: 1, type: 'img', src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500', caption: 'Us ❤️', rot: '-2deg', top: '15%', left: '10%' },
    { id: 2, type: 'note', text: 'Best day ever.', caption: 'Note', rot: '4deg', top: '25%', left: '55%' },
    { id: 3, type: 'img', src: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=500', caption: 'Adventures', rot: '-3deg', top: '55%', left: '30%' },
];

export default function Gallery() {
    const [activeId, setActiveId] = useState(null);

    return (
        <div className="min-h-screen bg-[#f3f0e9] overflow-hidden relative cursor-grab active:cursor-grabbing">

            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>

            <h1 className="absolute top-10 left-0 w-full text-center font-serif text-3xl md:text-5xl text-slate-800 opacity-30 z-0 tracking-widest font-black uppercase">
                Memory Lane
            </h1>

            {MEMORIES.map((mem) => (
                <div
                    key={mem.id}
                    onMouseEnter={() => setActiveId(mem.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className={`
                        absolute p-4 bg-white shadow-xl transition-all duration-500 ease-out border border-gray-200
                        ${activeId === mem.id ? 'z-50 scale-110 shadow-2xl rotate-0' : 'z-10 scale-100 grayscale-[20%]'}
                    `}
                    style={{
                        top: mem.top,
                        left: mem.left,
                        transform: activeId === mem.id ? 'scale(1.1)' : `rotate(${mem.rot})`,
                        width: '280px',
                    }}
                >
                    {/* TAPE EFFECT */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/40 rotate-1 backdrop-blur-sm shadow-sm"></div>

                    {mem.type === 'img' ? (
                        <div className="w-full aspect-square overflow-hidden mb-4 bg-gray-100">
                            <img src={mem.src} alt="" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-full aspect-square flex items-center justify-center p-6 bg-yellow-50 text-center font-serif text-2xl italic text-slate-800 leading-relaxed font-bold">
                            "{mem.text}"
                        </div>
                    )}

                    <p className="font-mono text-center text-slate-500 text-sm font-bold uppercase tracking-widest">
                        {mem.caption}
                    </p>
                </div>
            ))}
        </div>
    );
}