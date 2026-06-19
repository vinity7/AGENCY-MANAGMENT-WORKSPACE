import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, lazy, Suspense } from 'react';
import './index.css';
import RoleProtectedRoute from './components/RoleProtectedRoute';

const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const Projects = lazy(() => import('./pages/Projects'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Tasks = lazy(() => import('./pages/Tasks'));
const TaskProgress = lazy(() => import('./pages/TaskProgress'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Organization = lazy(() => import('./pages/Organization'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Sprints = lazy(() => import('./pages/Sprints'));
const Standup = lazy(() => import('./pages/Standup'));
const Blockers = lazy(() => import('./pages/Blockers'));
const Retro = lazy(() => import('./pages/Retro'));
const Layout = lazy(() => import('./components/Layout'));


const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0c0c0c] text-[#eeeeee]">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />


              {/* Protected Routes with Layout */}
              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />

                {/* Exclude owner/admin from Tasks */}
                <Route element={<RoleProtectedRoute allowedRoles={['product_owner', 'product_manager', 'scrum_master', 'developer', 'contributor', 'client', 'intern']} />}>
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tasks/:id/progress" element={<TaskProgress />} />
                </Route>

                {/* Scrum Routes */}
                <Route element={<RoleProtectedRoute allowedRoles={['owner', 'admin', 'product_manager', 'product_owner']} />}>
                  <Route path="/roadmap" element={<Roadmap />} />
                </Route>

                <Route element={<RoleProtectedRoute allowedRoles={['product_owner', 'scrum_master', 'developer', 'contributor']} />}>
                  <Route path="/sprints" element={<Sprints />} />
                  <Route path="/blockers" element={<Blockers />} />
                </Route>

                <Route element={<RoleProtectedRoute allowedRoles={['scrum_master', 'developer', 'contributor']} />}>
                  <Route path="/standup" element={<Standup />} />
                  <Route path="/retro" element={<Retro />} />
                </Route>

                {/* Role Protected Routes */}
                <Route element={<RoleProtectedRoute allowedRoles={['owner', 'admin', 'product_owner', 'product_manager']} />}>
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Route>

                <Route element={<RoleProtectedRoute allowedRoles={['owner', 'admin', 'product_owner', 'product_manager', 'client']} />}>
                  <Route path="/invoices" element={<Invoices />} />
                </Route>

                <Route element={<RoleProtectedRoute allowedRoles={['owner', 'admin']} />}>
                  <Route path="/organization" element={<Organization />} />
                </Route>
              </Route>


              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
