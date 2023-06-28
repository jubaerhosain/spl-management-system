import { Outlet, Link } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div>
      <ul style={{ display: "inline", margin: "5px" }}>
        <Link style={{ margin: "5px" }} to="/">
          home
        </Link>

        <Link style={{ margin: "5px" }} to="about">
          about
        </Link>

        <Link style={{ margin: "5px" }} to="login">
          login
        </Link>
        <Link style={{ margin: "5px" }} to="faculty">
          faculty
        </Link>
        <Link style={{ margin: "5px" }} to="projects">
          projects
        </Link>
        <Link style={{ margin: "5px" }} to="notices">
          notices
        </Link>
      </ul>
      <Outlet />
    </div>
  );
}
