import { useEffect, useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

const TeamSchedule = () => {
  const { user } = useContext(AuthContext);
  const [shifts, setShifts] = useState([]);
  const [teamId, setTeamId] = useState(user?.team_id || 1); // Default to user's team or 1
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, [teamId]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/teams/${teamId}/schedule`);
      setShifts(data.data);
    } catch (error) {
      console.error('Failed to fetch schedule', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Team Schedule</h1>
        
        {/* Simple Team Switcher for Demo */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Team ID:</span>
          <input 
            type="number" 
            value={teamId} 
            onChange={(e) => setTeamId(e.target.value)}
            className="border p-1 w-16 rounded text-center"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shifts.map((shift) => (
            <div key={shift.id} className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{formatDate(shift.start_time)}</h3>
                  <p className="text-blue-600 font-medium">
                    {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                  </p>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  Shift #{shift.id}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Required Roles</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {shift.required_roles.map(role => (
                    <span key={role} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Assigned Employees ({shift.assignments?.length || 0})
                </p>
                {shift.assignments && shift.assignments.length > 0 ? (
                  <ul className="space-y-2">
                    {shift.assignments.map(a => (
                      <li key={a.id} className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {a.name} <span className="text-xs text-gray-400 ml-1">({a.role})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">No assignments yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSchedule;