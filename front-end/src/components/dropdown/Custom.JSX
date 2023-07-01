import React, { useState, useEffect, useRef } from "react";

const DropdownMenu = ({ children, renderButton: RenderButton, ...rest }) => {
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
    <div {...rest} ref={dropdownRef}>
      <RenderButton onClick={toggleMenu} />
      {isOpen && <div className="menu">{children}</div>}
    </div>
  );
};

export default DropdownMenu;
const styles = "";

const App = () => {
  const NotificationButton = ({ ...rest }) => <button {...rest}>Toggle Menu</button>;

  return (
    <div>
      <h1>My App</h1>
      <DropdownMenu className={styles.notificationDropdown} renderButton={NotificationButton}>
        <p>Menu Item 1</p>
        <p>Menu Item 2</p>
        <p>Menu Item 3</p>
      </DropdownMenu>
    </div>
  );
};
