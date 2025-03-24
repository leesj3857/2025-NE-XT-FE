// src/App.tsx
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import { AboutPage, About } from './pages/About';
import Counter from './pages/Counter';
function App() {
  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/about" style={{ marginRight: '10px' }}>About</Link>
        <Link to="/aboutpage" style={{ marginRight: '10px' }}>AboutPage</Link>
        <Link to="/counter">Counter</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/aboutpage" element={<AboutPage />} />
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </div>
  );
}

export default App;
