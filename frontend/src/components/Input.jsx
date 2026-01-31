import React, { useState } from 'react';
import axios from 'axios';

const Input = ({ setResults, setLoading, loading }) => {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    state: '',
    occupation: ''
  });

  const [isOther, setIsOther] = useState(false);

  const occupationOptions = [
    "Student",
    "Artisan",
    "Farmer",
    "Street Vendor",
    "Unorganized Worker",
    "Retired",
    "Software Engineer (Test)"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setIsOther(true);
      setFormData({ ...formData, occupation: '' });
    } else {
      setIsOther(false);
      setFormData({ ...formData, occupation: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const payload = {
        age: Number(formData.age),
        income: Number(formData.income),
        state: formData.state,
        occupation: formData.occupation
      };

    //   const response = await axios.post('http://localhost:5000/api/check-eligibility', payload);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/check-eligibility`, payload);
      setResults(response.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch schemes. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
        <h2 className="font-bold text-slate-700">Citizen Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Age Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 28"
            required
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none"
          />
        </div>

        {/* Income Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Annual Income (₹)</label>
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            placeholder="e.g. 120000"
            required
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none bg-white"
          >
            <option value="">Select State</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>

        {/* Occupation Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Occupation</label>

          {/* The Select Box */}
          <select
            name="occupationSelect"
            value={isOther ? 'Other' : formData.occupation}
            onChange={handleDropdownChange}
            required={!isOther}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none bg-white mb-2"
          >
            <option value="">Select Occupation</option>
            {occupationOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            <option value="Other" className="font-bold text-orange-600">+ Other (Type Manually)</option>
          </select>

          {isOther && (
            <div className="animate-fade-in-down">
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Type your specific occupation here..."
                required
                autoFocus
                className="w-full p-2 border-2 border-orange-200 rounded bg-orange-50 focus:border-orange-500 outline-none text-slate-800"
              />
              <p className="text-xs text-slate-500 mt-1 ml-1">
                * Please type your specific trade or job title.
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded font-bold text-white transition-all shadow-md mt-2
            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg'}`}
        >
          {loading ? 'Analyzing Database...' : 'Get Schemes →'}
        </button>
      </form>
    </div>
  );
};

export default Input;
