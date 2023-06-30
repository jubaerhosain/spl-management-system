export default function ProfileButton() {
  return (
    <button
      type="button"
      className="flex mr-2 text-sm bg-gray-800 rounded-full nv:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
      id="user-menu-button"
      aria-expanded="false"
      data-dropdown-toggle="user-dropdown"
      data-dropdown-placement="bottom"
    >
      {/* <span className="sr-only">Open user menu</span> */}
      <img className="w-9 h-9 rounded-full" src="logo.png" alt="User" />
    </button>
  );
}
