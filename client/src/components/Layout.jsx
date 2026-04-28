import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex bg-[#0c0c0c]">
            <Sidebar />
            <div className="flex-1 ml-72 min-h-screen">
                <div className="max-w-screen-2xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
