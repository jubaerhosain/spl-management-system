import { Link, NavLink } from "react-router-dom";

export default function ToggleDropdown() {
  return (
    <div
      className="items-center justify-between hidden w-full nv:flex nv:w-auto nv:order-1"
      id="mobile-menu-2"
    >
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <NavLink
            to="/"
            className="block py-2 pl-3 pr-4 font-light text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            aria-current="page"
          >
            Home
          </NavLink>
        </li>
        <li className="dropdown">
          <NavLink
            to="/about"
            className="block py-2 pl-3 pr-4 font-light text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            About SPL
          </NavLink>
          <div className="dropdown-content z-50 border border-red-500  absolute overflow-auto font-light hidden">
            <ul>
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
          <NavLink
            to="/notices"
            className="block py-2 pl-3 pr-4 font-light text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            Notices
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/faculty"
            className="block py-2 pl-3 pr-4 font-light text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            Faculty
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/students"
            className="block py-2 pl-3 pr-4 font-light text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            Students
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className="block py-2 pl-3 pr-4 font-light text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className="block py-2 pl-3 pr-4 font-light text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
