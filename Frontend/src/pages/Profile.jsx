import { Outlet } from 'react-router-dom';
import DashboardLayout from '../Components/profileComponents/DashboardLayout';
const Profile = ({ user }) => {
  if (!user) return null;

  return (
    <DashboardLayout role={user.role}>
      <Outlet />
    </DashboardLayout>
  );
};

export default Profile;
