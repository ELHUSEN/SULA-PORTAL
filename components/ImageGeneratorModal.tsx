import React, { useState } from 'react';
import { X, Image as ImageIcon, Wand2, Download, RefreshCcw } from 'lucide-react';
import { generateImage } from '../services/geminiService';

interface ImageGeneratorModalProps {
  onClose: () => void;
}

const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1' },
  { label: '3:4', value: '3:4' },
  { label: '4:3', value: '4:3' },
  { label: '9:16', value: '9:16' },
  { label: '16:9', value: '16:9' },
  { label: '2:3', value: '3:4' }, // Map to closest supported
  { label: '3:2', value: '4:3' }, // Map to closest supported
  { label: '21:9', value: '16:9' }, // Map to closest supported
];

export const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Per instructions, check for API key selection
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Proceeding as instructed: assume selection successful after openSelectKey
      }

      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImageUrl(imageUrl);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key tidak valid atau belum dipilih. Silakan pilih kembali.");
        // @ts-ignore
        window.aistudio.openSelectKey();
      } else {
        setError("Gagal menghasilkan gambar. Pastikan prompt Anda sesuai dan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `sula-gen-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all w-full max-w-4xl border border-gray-200 dark:border-gray-800">
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-indigo-600">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Sula Art Generator
            </h3>
            <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Input Panel */}
            <div className="p-6 border-r border-gray-100 dark:border-gray-800">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Visual Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Contoh: Pemandangan matahari terbenam di Pantai Tanjung Waka dengan kapal nelayan tradisional..."
                    className="w-full h-32 p-4 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.label}
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          aspectRatio === ratio.value && (ratio.label === '1:1' || ratio.label === '3:4' || ratio.label === '4:3' || ratio.label === '9:16' || ratio.label === '16:9')
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400'
                        }`}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-100 dark:border-red-900/50">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Wand2 className="w-5 h-5" />
                  )}
                  {loading ? 'Sedang Memproses...' : 'Generate Visual'}
                </button>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50">
                   <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                     * Fitur ini memerlukan API Key berbayar. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline font-bold">Cek Dokumentasi Billing</a>.
                   </p>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center min-h-[300px]">
              {generatedImageUrl ? (
                <div className="w-full flex flex-col gap-4">
                  <div className="relative rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img src={generatedImageUrl} alt="Generated" className="w-full h-auto" />
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Simpan Gambar
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="max-w-[200px]">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Belum Ada Visual</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Masukkan deskripsi dan pilih aspek rasio untuk memulai.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
