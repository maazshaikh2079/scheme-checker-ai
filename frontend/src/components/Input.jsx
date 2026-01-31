// import React, { useState } from 'react';
// import axios from 'axios';

// const Input = ({ setResults, setLoading, loading }) => {
//   const [formData, setFormData] = useState({
//     age: '',
//     income: '',
//     state: '',
//     occupation: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResults(null); // Clear previous results

//     try {
//       // 1. Convert inputs to Numbers for backend logic
//       const payload = {
//         age: Number(formData.age),
//         income: Number(formData.income), // Handles '0' correctly
//         state: formData.state,
//         occupation: formData.occupation
//       };

//       // 2. Call the API
//       const response = await axios.post('http://localhost:5000/api/check-eligibility', payload);

//       // 3. Update App.jsx state
//       setResults(response.data);
//     } catch (error) {
//       console.error("API Error:", error);
//       alert("Failed to fetch schemes. Is the backend running on port 5000?");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
//       <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
//         <h2 className="font-bold text-slate-700">Citizen Details</h2>
//       </div>

//       <form onSubmit={handleSubmit} className="p-6 space-y-4">
//         {/* Age Input */}
//         <div>
//           <label className="block text-sm font-semibold text-slate-600 mb-1">Age</label>
//           <input
//             type="number"
//             name="age"
//             value={formData.age}
//             onChange={handleChange}
//             placeholder="e.g. 28"
//             required
//             className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none"
//           />
//         </div>

//         {/* Income Input */}
//         <div>
//           <label className="block text-sm font-semibold text-slate-600 mb-1">Annual Income (₹)</label>
//           <input
//             type="number"
//             name="income"
//             value={formData.income}
//             onChange={handleChange}
//             placeholder="e.g. 120000"
//             required
//             className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none"
//           />
//         </div>

//         {/* State Dropdown */}
//         <div>
//           <label className="block text-sm font-semibold text-slate-600 mb-1">State</label>
//           <select
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none bg-white"
//           >
//             <option value="">Select State</option>
//             <option value="Uttar Pradesh">Uttar Pradesh</option>
//             <option value="Maharashtra">Maharashtra</option>
//             <option value="Delhi">Delhi</option>
//             <option value="Karnataka">Karnataka</option>
//             <option value="Gujarat">Gujarat</option>
//             <option value="Tamil Nadu">Tamil Nadu</option>
//           </select>
//         </div>

//         {/* Occupation Dropdown */}
//         <div>
//           <label className="block text-sm font-semibold text-slate-600 mb-1">Occupation</label>
//           <select
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none bg-white"
//           >
//             <option value="">Select Occupation</option>
//             <option value="Student">Student</option>
//             <option value="Artisan">Artisan</option>
//             <option value="Farmer">Farmer</option>
//             <option value="Street Vendor">Street Vendor</option>
//             <option value="Unorganized Worker">Unorganized Worker</option>
//             <option value="Retired">Retired</option>
//             <option value="Software Engineer">Software Engineer (Test)</option>
//           </select>
//         </div>

//         {/* Action Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-3 px-4 rounded font-bold text-white transition-all shadow-md mt-2
//             ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg'}`}
//         >
//           {loading ? 'Analyzing Database...' : 'Get Schemes →'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Input;

import React, { useState } from 'react';
import axios from 'axios';

const Input = ({ setResults, setLoading, loading }) => {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    state: '',
    occupation: ''
  });

  // New state to track if "Other" is selected
  const [isOther, setIsOther] = useState(false);

  // Pre-defined list to check against
  const occupationOptions = [
    "Student",
    "Artisan",
    "Farmer",
    "Street Vendor",
    "Unorganized Worker",
    "Retired",
    "Software Engineer (Test)"
  ];

  // Generic handler for text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Specific handler for the Dropdown logic
  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setIsOther(true);
      setFormData({ ...formData, occupation: '' }); // Clear value so user can type
    } else {
      setIsOther(false);
      setFormData({ ...formData, occupation: value }); // Set selected value
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
        occupation: formData.occupation // This will now hold either the dropdown value or typed value
      };

      const response = await axios.post('http://localhost:5000/api/check-eligibility', payload);
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
            // If isOther is true, force value to 'Other', else show the actual occupation
            value={isOther ? 'Other' : formData.occupation}
            onChange={handleDropdownChange}
            required={!isOther} // Only required if we aren't typing manually
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-900 outline-none bg-white mb-2"
          >
            <option value="">Select Occupation</option>
            {occupationOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            <option value="Other" className="font-bold text-orange-600">+ Other (Type Manually)</option>
          </select>

          {/* Conditional Input Field for 'Other' */}
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

        {/* Action Button */}
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
