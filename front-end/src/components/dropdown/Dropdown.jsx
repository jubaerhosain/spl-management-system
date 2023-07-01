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
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown} {...rest} ref={dropdownRef}>
      <DropdownButton onClick={toggleMenu} />
      {isOpen && <DropDownMenu />}
    </div>
  );
};

export default Dropdown;

// const App = () => {
//   const NotificationButton = ({ ...rest }) => <button {...rest}>Toggle Menu</button>;

//   return (
//     <div>
//       <h1>My App</h1>
//       <Dropdown
//         // className={styles.notificationDropdown}
//         dropdownButton={NotificationButton}
//         dropdownMenu={"DropdownMenu"}
//       />
//     </div>
//   );
// };
