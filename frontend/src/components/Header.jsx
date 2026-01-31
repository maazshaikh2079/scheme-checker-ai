import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#002147] text-white py-5 shadow-lg border-b-4 border-orange-500">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            Bharat Welfare AI
          </h1>
          <p className="text-xs text-orange-400 uppercase tracking-wider mt-1">
            Government Scheme Eligibility Checker
          </p>
        </div>
        <div className="hidden md:block text-right">
          <span className="bg-white/10 px-3 py-1 rounded text-sm">
            Beta v1.0
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
