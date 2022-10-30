import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/home-page";
import Markets from "./pages/markets/markets";
import Leaderboard from "./pages/leaderboard/leaderboard";
import Pools from "./pages/pools/pools";
import Trade from "./pages/trade/trade";
import Navbar from "./components/navbar/navbar";

export function App() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </div>
  );
}

export default App;
