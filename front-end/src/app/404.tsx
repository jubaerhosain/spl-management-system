import Link from "next/link";

const Custom404 = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link href="/">
        <a>Go back to home</a>
      </Link>
    </div>
  );
};

export default Custom404;
