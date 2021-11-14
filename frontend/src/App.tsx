import React from 'react';
import {Route, Routes} from "react-router-dom";
import Home from './Home';
import Create from "./Create";

export default function App() {
    return <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/create" element={<Create />}/>
    </Routes>
}
