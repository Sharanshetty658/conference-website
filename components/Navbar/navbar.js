import Link from "next/link";
import Dropdown from "../illustration/dropdown";
import { useState, useEffect, useRef, useCallback } from "react";
import links from "../../config/links.json";
import NavDrop from "./navDrop";
import Hamburger from "../illustration/hamburger";
import { useMediaQuery } from "react-responsive";
import Cancel from "../illustration/cancel";
import Image from "next/image";

function Navbar() {
  const isTablet = useMediaQuery({ maxWidth: "1118px" });
  const [drop, setDrop] = useState(false);
  const [show, setShow] = useState(null);
  const [isSubMenuHovered, setIsSubMenuHovered] = useState(false);
  const menuRef = useRef(null);
  const svg = useRef(null);
  let closeTimeout = useRef(null);

  const handleClosing = useCallback(
    (event) => {
      if (show && !event.target.closest(".subMenu")) {
        setShow(null);
      }
    },
    [show],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClosing);
    return () => {
      document.removeEventListener("mousedown", handleClosing);
    };
  }, [handleClosing]);

  const handleCloseMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setDrop(false);
    }
    if (svg.current && event.target === svg.current) {
      setDrop(true);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleCloseMenu);
    return () => {
      document.removeEventListener("click", handleCloseMenu);
    };
  }, [menuRef]);

  const handleMouseEnter = (title) => {
    clearTimeout(closeTimeout.current);
    setShow(title);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      if (!isSubMenuHovered) {
        setShow(null);
      }
    }, 300);
  };

  const handleSubMenuEnter = () => {
    clearTimeout(closeTimeout.current);
    setIsSubMenuHovered(true);
  };

  const handleSubMenuLeave = () => {
    setIsSubMenuHovered(false);
    setShow(null);
  };

  return (
    <div className="relative">
      <div
        className={`container flex justify-center fixed items-center w-full backdrop-blur ${drop && "bg-[#1B1130]/90"} top-0 z-[99] text-white`}
      >
        <div className="p-5 flex justify-between h-[75px] w-full items-center">
          <div
            className="flex items-center sm:justify-between sm:w-full"
            data-test="nav-Home"
          >
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <Image
                  src="/img/logos/2025-logo.png"
                  alt="conference logo"
                  width={150}
                  height={33}
                />
              </div>
            </Link>
          </div>
          {isTablet ? (
            <div data-test="nav-Hamberger">
              {drop ? (
                <button>
                  <Cancel />
                </button>
              ) : (
                <button>
                  <Hamburger ref={svg} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              {links.map((link) => (
                <Link
                href={link.ref}
                key={link.title}
                className="mx-4 text-[14px] group cursor-pointer relative flex items-center"
                data-test={`nav-${link.title}`}
                onMouseEnter={() => handleMouseEnter(link.title)}
                onMouseLeave={handleMouseLeave}
              >
                {link.title}
                {link.subMenu && (
                  <Dropdown
                    color="white"
                    className={`ml-2 transition-transform duration-700 ${
                      show === link.title ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </Link>              
              ))}
            </div>
          )}
          {isTablet && drop && <NavDrop setDrop={setDrop} ref={menuRef} />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
