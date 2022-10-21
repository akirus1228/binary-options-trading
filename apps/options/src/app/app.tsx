import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/home-page";
import Markets from "./pages/markets/markets";
import Leaderboard from "./pages/leaderboard/leaderboard";
import Pools from "./pages/pools/pools";
import Navbar from "./components/navbar";

export function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pools" element={<Pools />} />
      </Routes>
    </>
  );
}

export default App;
