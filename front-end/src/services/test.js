import { useEffect, useState } from 'react';
import { useUserService } from './services/useUserService';

function UserComponent({ userId }) {
  const { fetchUser, loading, error } = useUserService();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const user = await fetchUser(userId);
      setUser(user);
    }

    fetchData();
  }, [fetchUser, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Render additional user details */}
    </div>
  );
}

export default UserComponent;
