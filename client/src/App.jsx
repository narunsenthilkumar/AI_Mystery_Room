import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateCasePage from './pages/CreateCasePage';
import InvestigationPage from './pages/InvestigationPage';
import AccusationPage from './pages/AccusationPage';
import ResultPage from './pages/ResultPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-noir-950 text-slate-100">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateCasePage />} />
            <Route path="/case/:id" element={<InvestigationPage />} />
            <Route path="/case/:id/accuse" element={<AccusationPage />} />
            <Route path="/case/:id/result" element={<ResultPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

