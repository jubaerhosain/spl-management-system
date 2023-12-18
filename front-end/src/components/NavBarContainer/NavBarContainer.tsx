import { useAuthContext } from '@/contexts/AuthContext';

const PublicNavBar: React.FC = () => {
    // Render your public navigation bar
    return <div>Public NavBar</div>;
};

const StudentNavBar: React.FC = () => {
    // Render your student navigation bar
    return <div>Student NavBar</div>;
};

const TeacherNavBar: React.FC = () => {
    // Render your teacher navigation bar
    return <div>Teacher NavBar</div>;
};

const NavBarContainer = () => {
    const { user } = useAuthContext();

    if (!user) {
        return <PublicNavBar />;
    }

    if (user.role === 'student') {
        return <StudentNavBar />;
    }

    if (user.role === 'teacher') {
        return <TeacherNavBar />;
    }

    // Default case, you may want to handle other roles or scenarios
    return null;
};

export default NavBarContainer;