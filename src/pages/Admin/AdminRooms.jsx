import { useEffect, useState } from "react";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    is_available: true,
    images: [], // Pastikan selalu array kosong sebagai default
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch semua kamar
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/admin/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data kamar");
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Ubah input form
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "images") {
      const fileArray = Array.from(files || []); // Pastikan tidak null
      setFormData({ ...formData, images: fileArray });

      // Buat preview URL
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Unggah gambar ke /upload
  const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((img) => formData.append("images", img));

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/admin/upload", {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Gagal mengunggah gambar");
    const data = await res.json();
    return data.image_urls || []; // Pastikan selalu array
  };

  // Submit form (buat atau edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    let imageUrls = [];
    if (formData.images.length > 0) {
      imageUrls = await uploadImages(formData.images); // Unggah gambar terlebih dahulu
    } else if (editId) {
      const room = rooms.find((r) => r.ID === editId);
      imageUrls = room.images || [];
    }

    const roomData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0, // Default ke 0 jika tidak valid
      is_available: formData.is_available,
      images: imageUrls,
    };

    const url = editId
      ? `http://localhost:8080/api/admin/rooms/${editId}`
      : "http://localhost:8080/api/admin/rooms";

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roomData),
    });

    if (!res.ok) {
      const errText = await res.text();
      setError(errText || "Gagal menyimpan data");
      return;
    }

    setIsFormOpen(false);
    setFormData({ name: "", description: "", price: "", is_available: true, images: [] });
    setPreviewImages([]);
    setEditId(null);
    fetchRooms();
  };

  // Edit
  const handleEdit = (room) => {
    setFormData({
      name: room.name,
      description: room.description,
      price: room.price.toString(),
      is_available: room.is_available,
      images: [],
    });
    setPreviewImages(room.images?.map((url) => "http://localhost:8080" + url) || []);
    setEditId(room.ID);
    setIsFormOpen(true);
  };

  // Hapus
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin hapus kamar ini?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/admin/rooms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRooms();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Kamar</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={() => {
          setFormData({
            name: "",
            description: "",
            price: "",
            is_available: true,
            images: [],
          });
          setPreviewImages([]);
          setEditId(null);
          setIsFormOpen(true);
        }}
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded mb-6"
      >
        Tambah Kamar
      </button>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Kamar" : "Tambah Kamar"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nama Kamar"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-3"
                required
              />

              <textarea
                name="description"
                placeholder="Deskripsi"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-3"
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Harga"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-3"
                required
              />

              <input
                type="file"
                name="images"
                onChange={handleChange}
                className="w-full border p-2 rounded mb-3"
                multiple
              />

              {/* Preview Gambar */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {previewImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                  className="mr-2"
                />
                Tersedia
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded"
                >
                  {editId ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List kamar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.ID} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
            <p className="text-gray-600">{room.description}</p>
            <p className="text-yellow-600 font-bold mt-2">
              Rp {room.price.toLocaleString()}
            </p>
            <p className="text-sm mt-1">
              Status:{" "}
              {room.is_available ? (
                <span className="text-green-600">Tersedia</span>
              ) : (
                <span className="text-red-600">Tidak tersedia</span>
              )}
            </p>

            {room.images && room.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {room.images.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:8080${img}`}
                    alt={`room-${i}`}
                    className="w-full h-24 object-cover rounded border"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                  />
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(room)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(room.ID)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}