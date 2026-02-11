import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Landing from "./pages/Landing";
import Create from "./pages/Create";
import Preview from "./pages/Preview";
import Love from "./pages/Love";
import Gallery from "./pages/Gallery.jsx";
import Countdown from "./pages/Countdown.jsx";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-rose-500/30">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/preview/:id" element={<Preview />} />
                    <Route path="/love/:id" element={<Love />} />
                    <Route path="/wait/:id" element={<Countdown />} />
                    <Route path="/gallery/:id" element={<Gallery />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}