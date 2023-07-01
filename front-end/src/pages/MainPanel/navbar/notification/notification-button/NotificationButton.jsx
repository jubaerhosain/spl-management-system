export default function Notification() {
  return (
    <button className="relative mr-4">
      <div className="flex items-center justify-center hover:bg-gray-500 bg-gray-300 rounded-full w-9 h-9">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
          <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
        </svg>
      </div>
      <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 mt-[-3px]">
        5{/* <!-- Replace with your notification count --> */}
      </span>
    </button>
  );
}
