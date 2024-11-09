import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import Submit from './Pages/Submit';
import RollingPaper from './Pages/Rollingpaper';

const App = () => {
    return (
        <Router>
            <Routes> {/* Switch 대신 Routes 사용 */}
                <Route path="/" element={<MainPage />} /> {/* component 대신 element 사용 */}
                <Route path="/submit" element={<Submit />} />
                <Route path="/rollingpaper" element={<RollingPaper />} />
            </Routes>
        </Router>
    );
}

export default App;
