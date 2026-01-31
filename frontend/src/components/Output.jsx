import React from 'react';

const Output = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl shadow border border-slate-200 text-center animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-32 bg-slate-100 rounded w-full"></div>
        <p className="text-slate-500 mt-4">Consulting Bharat Welfare Database...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // 3. Error/Empty Results State
  if (data.error) {
     return <div className="text-red-500 bg-red-50 p-4 rounded">{data.error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded shadow-sm">
        <h3 className="font-bold text-blue-900 text-sm uppercase mb-1">User Summary</h3>
        <p className="text-slate-800">{data.user_summary}</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          Eligible Schemes
          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200">
            {data.eligible_schemes?.length || 0} Found
          </span>
        </h3>

        {data.eligible_schemes?.length > 0 ? (
          data.eligible_schemes.map((scheme, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-slate-200 p-5 mb-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-[#002147]">{scheme.scheme_name}</h4>
                <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold border border-green-100">
                  ✓ Verified
                </span>
              </div>

              <div className="mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Benefit</span>
                <div className="bg-green-50 text-green-900 p-2 rounded text-sm mt-1 border border-green-100">
                  {scheme.benefit}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Reasoning</span>
                <p className="text-slate-600 text-sm italic mt-1">"{scheme.reasoning}"</p>
              </div>

              <button className="text-sm bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto">
                {scheme.action_step}
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-500 italic">No specific schemes found based on this profile.</p>
        )}
      </div>

      {data.not_eligible_notices?.length > 0 && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
          <h3 className="font-bold text-slate-600 text-sm uppercase mb-3">Not Eligible Notices</h3>
          <ul className="space-y-2">
            {data.not_eligible_notices.map((notice, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">●</span>
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center mt-8">
        {data.disclaimer}
      </p>
    </div>
  );
};

export default Output;
