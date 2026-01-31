import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Input from './components/Input';
import Output from './components/Output';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        {/* Pass state setters to Input */}
        <Input setResults={setResults} setLoading={setLoading} loading={loading} />

        {/* Pass data to Output */}
        <Output data={results} loading={loading} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
