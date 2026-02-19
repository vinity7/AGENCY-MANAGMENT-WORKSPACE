import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
