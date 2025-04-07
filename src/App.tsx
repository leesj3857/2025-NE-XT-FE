// src/App.tsx
import { Routes, Route } from 'react-router-dom';
// import Places from './pages/Places';
import Homepage from "./pages/Homepage.tsx";
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
