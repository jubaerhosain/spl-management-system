import { useState, useEffect, useRef } from "react";
import styles from "./Dropdown.module.css";

const Dropdown = ({ dropdownButton: DropdownButton, dropdownMenu: DropDownMenu, ...rest }) => {
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
