import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Dropdown.module.css";

const Dropdown = ({ dropdownButton: DropdownButton, dropdownMenu: DropDownMenu, ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();


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

  // hide dropdown if location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.dropdown} {...rest} ref={dropdownRef}>
      <DropdownButton onClick={toggleMenu} />
      {isOpen && <DropDownMenu />}
    </div>
  );
};

export default Dropdown;
