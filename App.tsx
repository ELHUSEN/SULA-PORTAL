import React, { useEffect, useState } from 'react';
import { fetchSheetData } from './services/sheetService';
import { AppState } from './types';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { DatasetList } from './components/DatasetList';
import { NewsModal } from './components/NewsModal';
import { ImageGeneratorModal } from './components/ImageGeneratorModal';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loading: true,
    error: null,
    sections: [],
    datasets: [],
    rawTextContext: ''
  });

  const [darkMode, setDarkMode] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { sections, datasets, rawText } = await fetchSheetData();
        setState({
          loading: false,
          error: null,
          sections,
          datasets,
          rawTextContext: rawText
        });
      } catch (err: any) {
        setState({
          loading: false,
          error: err.message || 'Failed to load sheet data.',
          sections: [],
          datasets: [],
          rawTextContext: ''
        });
      }
    };

    loadData();
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong.</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{state.error}</p>
            <p className="text-sm text-gray-400">Ensure the Google Sheet is published or accessible via link.</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
                Retry
            </button>
        </div>
      </div>
    );
  }

  // Filter sections by type (used if in Landing Page mode)
  const heroSection = state.sections.find(s => s.type === 'hero');
  const features = state.sections.filter(s => s.type === 'features').map(s => s.content);
  const pricing = state.sections.filter(s => s.type === 'pricing').map(s => s.content);
  const testimonials = state.sections.filter(s => s.type === 'testimonials').map(s => s.content);
  const footerData = state.sections.find(s => s.type === 'footer')?.content;
  const headerData = state.sections.find(s => s.type === 'header')?.content;

  // Decide view mode based on data presence
  const isDatasetView = state.datasets.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Header 
        title={headerData?.title || "PORTAL SATU DATA SULA"} 
        logo={headerData?.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Lambang_Kabupaten_Kepulauan_Sula.png/150px-Lambang_Kabupaten_Kepulauan_Sula.png"}
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        onNewsClick={() => setShowNews(true)}
        onGeneratorClick={() => setShowGenerator(true)}
      />
      
      <main className="flex-grow">
          {isDatasetView ? (
              <DatasetList datasets={state.datasets} />
          ) : (
              <>
                {heroSection && <Hero data={heroSection.content} />}
                {features.length > 0 && <Features items={features} />}
                {testimonials.length > 0 && <Testimonials items={testimonials} />}
                {pricing.length > 0 && <Pricing items={pricing} />}
              </>
          )}
      </main>
      
      <Footer data={footerData} />

      {/* Floating Chat Widget using Gemini */}
      <ChatWidget context={state.rawTextContext} />

      {/* News Modal */}
      {showNews && <NewsModal onClose={() => setShowNews(false)} />}

      {/* Image Generator Modal */}
      {showGenerator && <ImageGeneratorModal onClose={() => setShowGenerator(false)} />}
    </div>
  );
};

export default App;
