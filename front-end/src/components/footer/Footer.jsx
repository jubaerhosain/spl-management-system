export default function Footer() {
  return (
    <footer
      className="mt-auto z-20 w-full p-2 bg-white border-t border-gray-200 shadow 
    md:flex md:items-center md:justify-center dark:bg-gray-800 dark:border-gray-600"
    >
      <div className="flex flex-col justify-center m-auto">
        <p className="text-sm text-center text-gray-500 sm:text-center dark:text-gray-400">
          © 2023
          <a href="/" className="hover:underline ml-1 mr-1">
            IIT.
          </a>
          All Rights Reserved.
        </p>
        {/* <p className="text-sm text-center text-gray-500 sm:text-center dark:text-gray-400">
          Developed by Md. Jubaer Hosain (BSSE 11th) & Hasib Abdullah Sarker (BSSE 12th)
        </p> */}
      </div>
    </footer>
  );
}
