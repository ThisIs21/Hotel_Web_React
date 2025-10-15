import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  }, []);

  const handleRoomClick = (room) => {
    navigate(`/transaction/${room.ID}`, { state: { room } });
  };

  if (loading) {
    return <div className="text-center py-20">Memuat data kamar...</div>;
  }

  if (rooms.length === 0) {
    return <div className="text-center py-20">Belum ada kamar tersedia.</div>;
  }

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-12">
        Daftar Kamar <span className="text-yellow-500">Astro Highland</span>
      </h2>

      {/* Grid Kamar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div
            key={room.ID}
            className="bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden hover:scale-[1.02] transition cursor-pointer"
            onClick={() => handleRoomClick(room)}
          >
            <img
              src={room.image_url || "https://via.placeholder.com/400x250"}
              alt={room.name}
              className="w-full h-52 object-cover"
            />

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">{room.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {room.description || "Lokasi strategis dekat pusat kota"}
              </p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-600 font-medium">
                  {room.is_available ? "Tersedia" : "Tidak Tersedia"}
                </span>
                <span className="text-yellow-500 font-bold">
                  Rp {room.price ? room.price.toLocaleString("id-ID") : 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>WiFi Gratis • Parkir</span>
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-1">★ 4.5</span>
                  <span>(123 Rating)</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}