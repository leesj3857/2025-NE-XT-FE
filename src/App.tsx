// src/App.tsx
import { Routes, Route } from 'react-router-dom';
// import Places from './pages/Places';
import Homepage from "./pages/Homepage.tsx";
import Header from './components/Header';
import Footer from './components/Footer';
import Step from "./pages/Step.tsx"
import Map from "./pages/Map.tsx";
import MyPage from "./pages/MyPage.tsx";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {login, logout} from "./store/slices/userSlice.ts";
import {verifyAccessToken} from "./components/User/utils/verifyToken.ts";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {

    const verifyAndRestoreUser = async () => {
      const stored = localStorage.getItem('user');
      if (!stored) return;

      try {
        const parsed = JSON.parse(stored);
        const { name, email, accessToken, refreshToken } = parsed;

        const isValid = await verifyAccessToken(accessToken);
        if (isValid) {
          dispatch(login({ name, email, accessToken, refreshToken }));
        } else {
          throw new Error('Token invalid');
        }
      } catch {
        localStorage.removeItem('user');
        dispatch(logout());
      }
    };

    verifyAndRestoreUser();
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/step" element={<Step />} />
          <Route path="/map" element={<Map />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
