import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './ui/login';
import Register from './ui/register';
import Home from './home/home';
// import Board from './home/board';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/ui/login" element={<Login />} />
                <Route path="/ui/register" element={<Register />} />
                <Route path="/" element={<Login />} />

                <Route path="/:username/home/project/:projectid" element={<Home />} />
                <Route path="/:username/home" element={<Home />} />

            </Routes>
        </Router>
    );
};

export default App;
