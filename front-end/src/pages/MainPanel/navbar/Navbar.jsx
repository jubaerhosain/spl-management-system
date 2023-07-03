import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

// import NotificationButton from "./notification/notification-button/NotificationButton";
import ToggleButton from "./menu/toggle-button/ToggleButton";
import { useAuthProvider } from "@contexts/AuthProvider";
import ProfileDropdown from "./profile/ProfileDropdown";
import NotificationDropdown from "./notification/NotificationDropdown";

export default function Navbar() {
  const { user, loading } = useAuthProvider();
  const location = useLocation();


  if(loading) return <p>loading</p>

  return (
    <nav className={styles.navContainer}>
      <div>
        <Link to="/" className={styles.logo}>
          <img src="iitlogo-blue.png" alt="Logo" />
          <span>SPL</span>
        </Link>

        <div className={styles.userControl}>
          {user ? (
            <>
              <NotificationDropdown />
              <ProfileDropdown />
            </>
          ) : location.pathname == "/login" ? (
            <div></div>
          ) : (
            <Link
              to="/login"
              className={styles.login}
            >
              Login
            </Link>
          )}

          <ToggleButton />
          {/* <ToggleDropdown /> */}
        </div>

        <div className={styles.navLinks}>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="dropdown">
              <NavLink to="/about">About SPL</NavLink>
              <div className="dropdown-content z-50 border border-red-500  absolute overflow-auto font-light hidden">
                <ul className="text-black">
                  <li>
                    <Link>SPL - 1</Link>
                  </li>
                  <li>
                    <Link>SPL - 2</Link>
                  </li>
                  <li>
                    <Link>SPL - 3</Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <NavLink to="/notices">Notices</NavLink>
            </li>
            <li>
              <NavLink to="/faculty">Faculty</NavLink>
            </li>
            <li>
              <NavLink to="/students">Students</NavLink>
            </li>
            <li>
              <NavLink to="/projects">Projects</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
