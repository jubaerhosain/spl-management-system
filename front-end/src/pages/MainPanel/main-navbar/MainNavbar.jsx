import { Link, NavLink } from "react-router-dom";
import styles from "./MainNavbar.module.css";
import NotificationButton from "./notification-button/NotificationButton";
import ProfileButton from "./profile-button/ProfileButton";
import ToggleButton from "./toggle-button/ToggleButton";
// import ToggleDropdown from "./toggle-dropdown/ToggleDropdown";
import { useAuthProvider } from "@contexts/AuthProvider";

export default function MainNavbar() {
  const { user } = useAuthProvider();
  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logo}>
          <img src="iitlogo-blue.png" alt="Logo" />
          <span>SPL</span>
        </Link>

        <div className={styles.rightBox}>
          {user ? (
            <>
              <div className="flex items-center">
                <NotificationButton />
                {/* <NotificationDropdown /> */}
              </div>

              <div className="flex items-center">
                <ProfileButton />
                {/* <ProfileDropdown /> */}
              </div>
            </>
          ) : (
            <button className="bg-blue-900 hover:bg-blue-950 text-white font-semibold py-1 px-4 rounded">
              <Link to="/login">Login</Link>
            </button>
          )}

          <div className="flex items-center">
            <ToggleButton />
            {/* <ToggleDropdown /> */}
          </div>
        </div>

        <div className={styles.navLinkBox}>
          <ul>
            <li className={styles.navLink}>
              <NavLink to="/">Home</NavLink>
            </li>
            <li className={`${styles.navLink} dropdown`}>
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
            <li className={styles.navLink}>
              <NavLink to="/notices">Notices</NavLink>
            </li>
            <li className={styles.navLink}>
              <NavLink to="/faculty">Faculty</NavLink>
            </li>
            <li className={styles.navLink}>
              <NavLink to="/students">Students</NavLink>
            </li>
            <li className={styles.navLink}>
              <NavLink to="/projects">Projects</NavLink>
            </li>
            <li className={styles.navLink}>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
