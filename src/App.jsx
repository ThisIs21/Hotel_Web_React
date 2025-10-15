import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Rooms from "./pages/Rooms";
import Transaction from "./pages/Transaction";
import Footer from "./components/Footer";
import SwimmingPool from "./pages/facilities/SwimmingPool";
import FitnessCentre from "./pages/facilities/FitnessCentre";
import AdventurePark  from "./pages/facilities/AdventurePark";

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/facilities/swimming-pool" element={<SwimmingPool />} />
          <Route path="/facilities/:fitness-centre" element={<FitnessCentre />} />
          <Route path="/facilities/adventure-park" element={<AdventurePark />} />
          <Route path="/transaction/:roomId" element={<Transaction />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;