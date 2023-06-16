import { useAuthProvider } from "@contexts/AuthProvider";

export default function AdminDashboard() {
  const { logout } = useAuthProvider();

  const dashboardStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  };

  const sectionStyle = {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "5px",
  };

  const profileSectionStyle = {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "5px",
  };

  const headingStyle = {
    marginTop: "0",
    fontSize: "24px",
  };

  const subheadingStyle = {
    fontSize: "20px",
  };

  return (
    <div style={dashboardStyle}>
      <h1 style={headingStyle}>Admin Dashboard</h1>

      <div style={profileSectionStyle}>
        <h2 style={subheadingStyle}>Profile</h2>
        {/* Profile content here */}
      </div>

      <div style={sectionStyle}>
        <h2 style={subheadingStyle}>Student Management</h2>
        {/* Student management content here */}
      </div>

      <div style={sectionStyle}>
        <h2 style={subheadingStyle}>Course Management</h2>
        {/* Course management content here */}
      </div>

      <div style={sectionStyle}>
        <h2 style={subheadingStyle}>Faculty Management</h2>
        {/* Faculty management content here */}
      </div>

      <div style={sectionStyle}>
        <h2 style={subheadingStyle}>Task Management</h2>
        {/* Task management content here */}
      </div>

      <div style={sectionStyle}>
        <h2 style={subheadingStyle}>Reports and Analytics</h2>
        {/* Reports and analytics content here */}
      </div>

      <div style={sectionStyle}>
        <h2 style={subheadingStyle}>System Settings</h2>
        {/* System settings content here */}
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
