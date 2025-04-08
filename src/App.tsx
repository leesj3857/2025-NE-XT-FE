// src/App.tsx
import { Routes, Route } from 'react-router-dom';
// import Places from './pages/Places';
import Homepage from "./pages/Homepage.tsx";
import Header from './components/Header';
import Footer from './components/Footer';
import Step from "./pages/Step.tsx"
import Map from "./pages/Map.tsx";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/step" element={<Step />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
