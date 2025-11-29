import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import TeamSchedule from './pages/TeamSchedule';
import AttendanceDashboard from './pages/AttendanceDashboard';
import AssignShift from './pages/AssignShift';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Navbar />
      
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Require Login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TeamSchedule />} />
          <Route path="/attendance" element={<AttendanceDashboard />} />
        </Route>

        {/* Protected + Role Restricted (Admin/Scheduler only) */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'scheduler']} />}>
          <Route path="/assign" element={<AssignShift />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;