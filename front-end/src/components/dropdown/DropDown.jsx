import React, { useState, useEffect, useRef } from "react";

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef}>
      <button onClick={toggleMenu}>Toggle Menu</button>
      {isOpen && <div className="menu">{children}</div>}
    </div>
  );
};

export default DropdownMenu;

const App = () => {
  return (
    <div>
      <h1>My App</h1>
      <DropdownMenu>
        <p>Menu Item 1</p>
        <p>Menu Item 2</p>
        <p>Menu Item 3</p>
      </DropdownMenu>
    </div>
  );
};
