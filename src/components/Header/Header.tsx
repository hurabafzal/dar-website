import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faBars, faTimes, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/helpers/jwtHelper";
import AuthModal from "../authModal";
import { useAuth } from "@/context/AuthContext";
import logoImage from "../../../public/assets/dar-logo.png";
import Image from "next/image";
import Button from "../Button/Button";
import { setLanguageCookie } from "@/lib/cookies/setCookies";

function Header() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, setUser, language, setLanguage, messages } = useAuth();
  const headers = [
    // messages?.header?.contactUs,
    messages?.header?.appointment,
    messages?.header?.aboutUs,
    // messages?.header?.category,
    messages?.header?.projects,
    messages?.header?.catalog,
  ];

  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    setLanguageCookie(e.target.value);
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setMenuOpen(false); // Close the menu after navigation
    router.push(link); // Redirect to the clicked link
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setMenuOpen(false); // Close the sidebar if the modal is opened
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false); // Close menu if click is outside the sidebar
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="p-2 bg-white shadow-lg fixed top-0 left-0 w-full z-10">
      <div className="flex items-center justify-between px-8">
        {/* Logo */}
        <div
          className="cursor-pointer flex-grow"
          onClick={() => handleLinkClick("/home")}
        >
          <Image src={logoImage} alt="Logo" className="h-14 w-40" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-6">
          {headers.map((link, index) => {
            const href = `/${link?.toLowerCase()?.replace(" ", "-")}`;
            return (
              <button
                key={index}
                onClick={() => handleLinkClick(href)}
                className={`text-sm font-bold ${
                  activeLink === href ? "text-gray-400" : "text-gray-700"
                } hover:text-[#0d5362]`}
              >
                {link}
              </button>
            );
          })}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-28 text-lg font-semibold text-gray-700 bg-white rounded-lg focus:outline-none"
          >
            <option value="en">En 🇺🇸</option>
            <option value="ar">عربي 🇸🇦</option>
          </select>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-gray-400 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          {!user?.sub ? (
            <Button text={messages?.header?.login} onClick={openAuthModal} />
          ) : (
            <Button
              text={messages?.header?.logout}
              onClick={() =>
                logoutUser().then(() => {
                  setUser({ sub: "", name: "" });
                  router.push("/");
                })
              }
            />
          )}
        </div>

        {/* Hamburger Menu */}
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-3xl text-gray-400 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-3/4 bg-[#0d5362] z-20 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start space-y-6 p-6">
          {headers.map((link, index) => {
            const href = `/${link?.toLowerCase()?.replace(" ", "-")}`;
            return (
              <button
                key={index}
                onClick={() => handleLinkClick(href)}
                className="text-lg font-bold text-white hover:text-teal-200 montserrat-font"
              >
                {link}
              </button>
            );
          })}
          {!user && (
            <button
              onClick={openAuthModal}
              className="text-lg font-bold text-white hover:text-teal-200 flex items-center montserrat-font"
            >
              <FontAwesomeIcon icon={faUserAlt} className="mr-2" />
              Login
            </button>
          )}
          {user && (
            <button
              onClick={() =>
                logoutUser().then(() => {
                  setUser({ sub: "", name: "" });
                  toggleMenu();
                  router.push("/");
                })
              }
              className="text-lg font-bold text-white hover:text-teal-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={"login"}
      />
    </nav>
  );
}

export default Header;
