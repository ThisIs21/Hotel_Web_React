import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
{/* Admin*/}
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/DashboardAdmin";
import AdminRooms from "./pages/Admin/AdminRooms";
{/* Public */}
import HomePage from "./pages/HomePage";
import Rooms from "./pages/Rooms";
import Transaction from "./pages/Transaction";
import Footer from "./components/Footer";
import SwimmingPool from "./pages/facilities/SwimmingPool";
import FitnessCentre from "./pages/facilities/FitnessCentre";
import AdventurePark  from "./pages/facilities/AdventurePark";
import Transportation from "./pages/facilities/Transportation";
function AppContent() {
  const location = useLocation();
  //analogi use location :"Tolong berikan saya alamat saat ini (URL) di mana pengunjung sedang berdiri."
  // Cek apakah path saat ini dimulai dengan "/admin"
  // Misalnya: /admin/login, /admin/dashboard
  const isAdminRoute = location.pathname.startsWith("/admin"); //analogi: "Saya akan periksa alamat ini. Apakah alamat ini dimulai dengan kata /admin?"

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      
      {/*
       1. Navbar Hanya Muncul JIKA BUKAN Admin Route
       analogi: 	"JANGAN tampilkan Navbar" jika pengunjung sedang berada di alamat yang ada kata /admin-nya.
       */}
      {!isAdminRoute && <Navbar />}  
      
      <Routes>
        {/* Admin*/}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        <Route path="/admin/rooms" element={<AdminRooms />} />
        
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<Rooms />} />
        
        {/* PENTING: Perbaiki Route Swimming Pool (Hapus URL Parameter) */}
        <Route path="/facilities/swimming-pool" element={<SwimmingPool />} /> 
        <Route path="/facilities/fitness-centre" element={<FitnessCentre />} />
        <Route path="/facilities/adventure-park" element={<AdventurePark />} />
        <Route path="/facilities/transportation" element={<Transportation />} />
        
        <Route path="/transaction/:roomId" element={<Transaction />} />
      </Routes>
      
      {/* 2. Footer Hanya Muncul JIKA BUKAN Admin Route */}
      {!isAdminRoute && <Footer />}
      
    </div>
  );
}

function App() {
    // Component utama App hanya membungkus Router
    return (
        <Router>
            {/* Memindahkan logika ke komponen terpisah agar useLocation dapat digunakan */}
            <AppContent /> 
        </Router>
    );
}

export default App;