import React, { useState, useEffect } from 'react';
import { Dataset } from '../types';
import { Calendar, Building2, BarChart2, ExternalLink, Info, Table as TableIcon, Eye, ArrowUpRight } from 'lucide-react';

interface DatasetCardProps {
  data: Dataset;
}

// Comprehensive mapping of sectors to Unsplash images
const SECTOR_IMAGES: Record<string, string> = {
  'kesehatan': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  'pendidikan': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  'ekonomi': 'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&w=800&q=80',
  'keuangan': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  'perdagangan': 'https://images.unsplash.com/photo-1472851294608-415522f96319?auto=format&fit=crop&w=800&q=80',
  'pertanian': 'https://images.unsplash.com/photo-1625246333195-55197fe9f4db?auto=format&fit=crop&w=800&q=80',
  'pangan': 'https://images.unsplash.com/photo-1625246333195-55197fe9f4db?auto=format&fit=crop&w=800&q=80',
  'sosial': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
  'kependudukan': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
  'infrastruktur': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'pemerintahan': 'https://images.unsplash.com/photo-1555848960-8c3fd4eff5f3?auto=format&fit=crop&w=800&q=80',
  'pariwisata': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'transportasi': 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=800&q=80',
  'perhubungan': 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=800&q=80',
  'lingkungan': 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80',
  'industri': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  'hukum': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
  'teknologi': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
};

const IRB_DATA = [
  { year: '2020', value: '152,37' },
  { year: '2021', value: '157,17' },
  { year: '2022', value: '157,17' },
  { year: '2023', value: '157,17' },
  { year: '2024', value: '154,03' },
];

const IRB_IMAGE_URL = 'https://drive.google.com/uc?export=view&id=1P_daPjN-ui_t1UcRZ4c-eA7Fo4ylHQw1';

export const DatasetCard: React.FC<DatasetCardProps> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');

  const isIRB = data.name.toLowerCase().includes('indeks resiko bencana');

  // Determine fallback image based on sector
  const getFallbackImage = (sector: string) => {
    const s = (sector || '').toLowerCase();
    // Find matching key in SECTOR_IMAGES
    const key = Object.keys(SECTOR_IMAGES).find(k => s.includes(k));
    return key ? SECTOR_IMAGES[key] : SECTOR_IMAGES['default'];
  };

  useEffect(() => {
    if (isIRB) {
        setImgSrc(IRB_IMAGE_URL);
    } else if (data.image && data.image.trim().length > 5 && (data.image.startsWith('http') || data.image.startsWith('data:'))) {
        setImgSrc(data.image);
    } else {
        setImgSrc(getFallbackImage(data.sector));
    }
  }, [data, isIRB]);

  const handleImageError = () => {
    // If the image fails to load, switch to fallback
    const fallback = getFallbackImage(data.sector);
    if (imgSrc !== fallback) {
        setImgSrc(fallback);
    }
  };

  // Helper to detect if link is an embed code
  const isEmbedCode = (str: string) => {
    return (str || '').trim().startsWith('<iframe') || (str || '').trim().startsWith('<div');
  };

  // Safe color generation based on sector for badges
  const getSectorColor = (sector: string) => {
    const s = (sector || '').toLowerCase();
    if (s.includes('kesehatan') || s.includes('pendidikan')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (s.includes('ekonomi') || s.includes('dagang') || s.includes('uang') || s.includes('industri') || s.includes('keuangan')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (s.includes('lingkungan') || s.includes('alam') || s.includes('tani') || s.includes('pangan') || s.includes('hutan')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    if (s.includes('teknologi') || s.includes('tik') || s.includes('infrastruktur') || s.includes('transport') || s.includes('hub ung')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (s.includes('sosial') || s.includes('penduduk') || s.includes('wisata') || s.includes('budaya')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (s.includes('pemerintah') || s.includes('hukum') || s.includes('pegawai')) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full group">
      {/* Header Image */}
      <div className="relative h-44 sm:h-48 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-2xl">
        <img 
          src={imgSrc} 
          onError={handleImageError}
          alt={data.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${data.accessStatus.toLowerCase().includes('terbuka') ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
            {data.accessStatus || 'Public'}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Producer & Sector */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-md">
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate flex-1 tracking-tight">{data.producer}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {data.name}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-tight ${getSectorColor(data.sector)}`}>
            {data.sector}
          </span>
          {data.frequency && (
             <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
               <Calendar className="w-3 h-3 mr-1" />
               {data.frequency}
             </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-3 leading-relaxed">
            {data.definition || data.description || "Informasi detail mengenai dataset ini dapat dilihat pada bagian rincian."}
        </p>

        {/* Stats Row */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
             <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-0.5">Pembaruan</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{data.updateDate || '-'}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-0.5">Satuan</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{data.unit || '-'}</span>
             </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap sm:flex-nowrap gap-2">
            {/* Pratinjau Button (Universal for Data with Link or special case IRB) */}
            {(data.link || isIRB) && (
              <button 
                onClick={() => setShowEmbed(!showEmbed)}
                className={`flex-grow inline-flex justify-center items-center px-4 py-2.5 border text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 ${
                  showEmbed 
                    ? 'bg-indigo-700 text-white border-indigo-700' 
                    : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'
                }`}
              >
                {showEmbed ? 'Tutup Pratinjau' : 'Pratinjau'} 
                {isIRB ? <TableIcon className="ml-2 w-4 h-4" /> : <Eye className="ml-2 w-4 h-4" />}
              </button>
            )}

            {/* If it's a direct link that is NOT an embed, we also offer a separate Direct Open button */}
            {data.link && !isEmbedCode(data.link) && !isIRB && (
               <a 
                  href={data.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                  title="Buka Langsung"
               >
                  <ArrowUpRight className="w-4 h-4" />
               </a>
            )}

            <button 
                onClick={() => setExpanded(!expanded)}
                className={`inline-flex justify-center items-center px-3 py-2.5 border rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${expanded ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                title="Rincian Dataset"
            >
                <Info className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && (
          <div className="px-5 pb-5 pt-4 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700/50 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
             <dl className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                 <div className="sm:col-span-1">
                     <dt className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Kode Data</dt>
                     <dd className="mt-1 font-medium text-gray-900 dark:text-white break-all">{data.code || '-'}</dd>
                 </div>
                 <div className="sm:col-span-1">
                     <dt className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Klasifikasi</dt>
                     <dd className="mt-1 font-medium text-gray-900 dark:text-white">{data.classification || '-'}</dd>
                 </div>
                 <div className="sm:col-span-2">
                     <dt className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Keterangan</dt>
                     <dd className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">{data.description || '-'}</dd>
                 </div>
                  <div className="sm:col-span-2">
                     <dt className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Kegiatan Statistik</dt>
                     <dd className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">{data.activity || '-'}</dd>
                 </div>
             </dl>
          </div>
      )}

      {/* Custom Data Preview or Embed Area */}
      {showEmbed && (
          <div className="p-4 bg-slate-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
             {isIRB ? (
                 <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-inner border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tahun</th>
                                <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nilai IRB</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                            {IRB_DATA.map((row) => (
                                <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-4 py-2.5 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{row.year}</td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             ) : data.link && isEmbedCode(data.link) ? (
                <div className="relative w-full overflow-hidden rounded-xl bg-white shadow-inner" dangerouslySetInnerHTML={{ __html: data.link }} />
             ) : data.link ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center shadow-inner">
                   <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                      <ExternalLink className="w-6 h-6" />
                   </div>
                   <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Tautan Dataset Tersedia</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Dataset ini tidak dapat ditampilkan secara langsung di halaman ini. Silakan buka melalui tautan resmi.</p>
                   <a 
                      href={data.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                   >
                      Buka di Tab Baru <ArrowUpRight className="w-3 h-3" />
                   </a>
                </div>
             ) : (
                <div className="text-center py-6 text-xs text-gray-400">
                   Konten pratinjau tidak tersedia.
                </div>
             )}
          </div>
      )}
    </div>
  );
};