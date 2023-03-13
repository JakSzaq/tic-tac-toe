import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainScreen from './pages/MainScreen';
import GameScreen from './pages/GameScreen';

function App() {

  return (
    <div className="AppContainer">
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/room" element={<GameScreen />} />
        </Routes>

    </div>
  );
}

export default App;
