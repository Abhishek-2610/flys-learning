import { useState } from 'react';
import axiosClient from '../api/axiosClient';

const AssignShift = () => {
  const [formData, setFormData] = useState({ shiftId: '', employeeId: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Basic Client Validation
    if (!formData.shiftId || !formData.employeeId) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await axiosClient.post(`/shifts/${formData.shiftId}/assign`, {
        employeeId: parseInt(formData.employeeId)
      });
      setMessage("✅ Assignment Successful!");
      setFormData({ shiftId: '', employeeId: '' }); // Reset form
    } catch (err) {
      // Logic: Backend returns 409 for Rule Violations (Conflict, Team Mismatch, Qual)
      if (err.response && err.response.data) {
        setError(`❌ ${err.response.data.reason || err.response.data.message}`);
      } else {
        setError("❌ Server Error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Assign Employee to Shift</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-700">
            <strong>Rules Enforced:</strong>
            <ul className="list-disc ml-5 mt-1">
              <li>No overlapping shifts (Conflict).</li>
              <li>Employee must match Shift Team.</li>
              <li>Employee must have required Role.</li>
            </ul>
          </p>
        </div>

        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Shift ID</label>
            <input
              type="number"
              value={formData.shiftId}
              onChange={(e) => setFormData({...formData, shiftId: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input
              type="number"
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Assign Shift
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignShift;