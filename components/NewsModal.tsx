import React from 'react';
import { X, ExternalLink, Calendar, ArrowRight } from 'lucide-react';

interface NewsModalProps {
  onClose: () => void;
}

// Mock data reflecting recent typical activities from kepulauansulakab.go.id
// In a production backend environment, this would be replaced by an RSS fetch or API scraper.
const NEWS_ITEMS = [
  {
    id: 1,
    title: "Bupati Kepulauan Sula Fifian Adeningsi Mus Resmikan Puskesmas Baru di Mangoli",
    date: "12 Oktober 2024",
    snippet: "Bupati berharap fasilitas kesehatan baru ini dapat meningkatkan pelayanan medis bagi masyarakat di wilayah pulau Mangoli secara maksimal.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    link: "https://kepulauansulakab.go.id"
  },
  {
    id: 2,
    title: "Pemkab Sula Gelar Pasar Murah untuk Tekan Inflasi Daerah",
    date: "10 Oktober 2024",
    snippet: "Dinas Perindagkop menggelar pasar murah di berbagai titik untuk memastikan ketersediaan bahan pokok dengan harga terjangkau bagi masyarakat.",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80",
    link: "https://kepulauansulakab.go.id"
  },
  {
    id: 3,
    title: "Dinas Kominfo Sula Lakukan Sosialisasi Satu Data Indonesia",
    date: "08 Oktober 2024",
    snippet: "Sosialisasi ini bertujuan untuk menyamakan persepsi antar OPD terkait pentingnya integrasi data untuk pembangunan daerah.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    link: "https://kepulauansulakab.go.id"
  },
  {
    id: 4,
    title: "Rapat Paripurna DPRD Bahas APBD Perubahan Tahun Anggaran 2024",
    date: "05 Oktober 2024",
    snippet: "Eksekutif dan Legislatif bersinergi membahas prioritas anggaran untuk percepatan pembangunan infrastruktur di Kepulauan Sula.",
    image: "https://images.unsplash.com/photo-1555848960-8c3fd4eff5f3?auto=format&fit=crop&w=800&q=80",
    link: "https://kepulauansulakab.go.id"
  },
  {
    id: 5,
    title: "Promosi Wisata: Festival Tanjung Waka Masuk Kalender Event Nasional",
    date: "01 Oktober 2024",
    snippet: "Keindahan alam Tanjung Waka terus dipromosikan untuk menarik wisatawan domestik maupun mancanegara.",
    image: "https://images.unsplash.com/photo-1596423736858-292193568779?auto=format&fit=crop&w=800&q=80",
    link: "https://kepulauansulakab.go.id"
  },
  {
    id: 6,
    title: "Pelatihan Digital Marketing untuk UMKM Sula",
    date: "28 September 2024",
    snippet: "Pemerintah daerah mendorong pelaku UMKM untuk memanfaatkan teknologi digital dalam memasarkan produk lokal.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    link: "https://kepulauansulakab.go.id"
  }
];

export const NewsModal: React.FC<NewsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-5xl border border-gray-200 dark:border-gray-700">
          
          {/* Modal Header */}
          <div className="bg-indigo-600 px-4 py-4 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-bold leading-6 text-white flex items-center gap-2" id="modal-title">
              <ExternalLink className="w-5 h-5" />
              BERITA TERBARU KABUPATEN KEPULAUAN SULA
            </h3>
            <button
              type="button"
              className="rounded-md bg-indigo-600 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="px-4 py-6 sm:px-6 bg-gray-50 dark:bg-gray-900 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {NEWS_ITEMS.map((news) => (
                    <div key={news.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="h-40 w-full overflow-hidden">
                            <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <Calendar className="w-3 h-3 mr-1" />
                                {news.date}
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400">
                                <a href={news.link} target="_blank" rel="noopener noreferrer">
                                    {news.title}
                                </a>
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
                                {news.snippet}
                            </p>
                            <a 
                                href={news.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-auto inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Baca Selengkapnya <ArrowRight className="w-3 h-3 ml-1" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-center">
                <a 
                    href="https://kepulauansulakab.go.id" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-800 dark:text-indigo-300 dark:hover:bg-gray-700 transition-colors"
                >
                    Kunjungi Website Resmi kepulauansulakab.go.id
                    <ExternalLink className="ml-2 -mr-1 w-4 h-4" />
                </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};