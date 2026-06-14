import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubjectPage from './pages/SubjectPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Router basename="/grade3">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:subject" element={<SubjectPage />} />
        <Route path="/game/:subject/:gameId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
