import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll untuk efek navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dropdown items
  const dropdownItems = {
    Rooms: ["Deluxe Room", "Suite Room", "Villa"],
    Facilities: ["Adventure Park", "Swimming Pools", "Fitness Centre", "Parking"],
    Activities: ["Hiking", "Cycling", "Campfire"],
    Dining: ["Restaurant", "Bar", "Cafe"],
    "Meeting Events": ["Conference Hall", "Wedding Venue"],
    Contact: [], // Item baru tanpa dropdown untuk saat ini
  };

  // Handle dropdown hover dengan timeout untuk mencegah flicker
  const handleMouseEnter = (menu) => setOpenMenu(menu);
  const handleMouseLeave = () => setTimeout(() => setOpenMenu(null), 200);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-md h-16" : "bg-black h-24"
      }`}
    >
      <div className="flex items-center justify-between w-full px-6 mx-auto max-w-7xl h-full">
        {/* Logo - Di ujung kiri, berpindah ke tengah di mobile */}
        <div className="flex items-center space-x-2 md:ml-0">
          <img
            src="/img/logo.png"
            alt="Astro Highland Logo"
            className={`transition-all duration-300 object-contain ${
              isScrolled ? "h-20" : "h-30"
            } ${isMobileMenuOpen ? "mx-auto" : ""}`}
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <ul
          className={`${
            isMobileMenuOpen ? "flex flex-col" : "hidden"
          } md:flex md:items-center md:space-x-6 lg:space-x-8 font-medium absolute md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none ${
            isScrolled ? "text-white" : "text-gray-300"
          }`}
        >
          {Object.keys(dropdownItems).map((menu) => (
            <li
              key={menu}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(menu)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="hover:text-yellow-600 py-2 w-full text-left">
                {menu}
              </button>
              {openMenu === menu && dropdownItems[menu].length > 0 && (
                <div className="absolute top-full left-0 bg-black border border-gray-800 shadow-lg mt-2 rounded-lg py-2 w-48 z-50">
                  {dropdownItems[menu].map((item, i) => (
                    <Link
                      key={i}
                      to={`/${menu.toLowerCase().replace(" ", "-")}/${item
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-900 hover:text-yellow-300"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}

          <li>
            <Link
              to="/gallery"
              className="hover:text-yellow-600 py-2 block md:inline-block"
            >
              Gallery
            </Link>
          </li>
        </ul>

        {/* Book Now Button - Di ujung kanan */}
        <div className="hidden md:block mr-0">
          <Link
            to="/rooms"
            className="bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-yellow-400 transition text-sm shadow-md"
          >
            BOOK NOW
          </Link>
        </div>
      </div>
    </nav>
  );
}