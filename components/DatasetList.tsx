import React, { useState, useMemo } from 'react';
import { Dataset } from '../types';
import { DatasetCard } from './DatasetCard';
import { AIInsight } from './AIInsight';
import { Search, Filter, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DatasetListProps {
  datasets: Dataset[];
}

export const DatasetList: React.FC<DatasetListProps> = ({ datasets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // Extract unique sectors for the filter
  const sectorsFilter = ['All', ...Array.from(new Set(datasets.map(d => d.sector).filter(Boolean)))];

  // Calculate top 10 sectors for the chart
  const sectorData = useMemo(() => {
    const counts: Record<string, number> = {};
    datasets.forEach(d => {
      const s = d.sector || 'Lainnya';
      counts[s] = (counts[s] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [datasets]);

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || d.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#64748b'];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Katalog Data Sula</h2>
            <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">
                Akses {datasets.length} dataset terbuka dari berbagai instansi pemerintah di Kabupaten Kepulauan Sula untuk mendukung transparansi dan inovasi.
            </p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[280px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                    placeholder="Cari dataset atau produsen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="relative w-full sm:w-auto">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none transition-all"
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                >
                    {sectorsFilter.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
             </div>
        </div>
      </div>

      {/* Statistics Section with Bar Chart */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sebaran Dataset Per Sektor (Top 10)</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  angle={-35} 
                  textAnchor="end" 
                  interval={0} 
                  height={60} 
                  tick={{ fontSize: 10, fontWeight: 500, fill: '#6b7280' }}
                  stroke="transparent"
                />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} stroke="transparent" />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={35}>
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-indigo-200" />
              <h3 className="text-lg font-bold">Ringkasan Statistik</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Total Dataset</p>
                <p className="text-4xl font-black">{datasets.length}</p>
              </div>
              <div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Total Sektor</p>
                <p className="text-4xl font-black">{sectorsFilter.length - 1}</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-indigo-100 text-xs italic">
                  Data diperbarui secara otomatis dari sistem Satu Data Indonesia (SDI) Kabupaten Kepulauan Sula.
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => document.getElementById('ai-insight-box')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-sm font-bold transition-all border border-white/20"
          >
            Lihat Analisis AI
          </button>
        </div>
      </div>

      {/* AI Insight Section */}
      <div id="ai-insight-box">
        <AIInsight datasets={filteredDatasets.length > 0 ? filteredDatasets : datasets} />
      </div>

      {filteredDatasets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
            {filteredDatasets.map((dataset, idx) => (
            <DatasetCard key={idx} data={dataset} />
            ))}
        </div>
      ) : (
          <div className="text-center py-24 bg-white dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data tidak ditemukan</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Maaf, kami tidak dapat menemukan dataset yang sesuai dengan "{searchTerm}". Coba kata kunci lain atau reset filter.
              </p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedSector('All');}}
                className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Reset Semua Filter
              </button>
          </div>
      )}
    </div>
  );
};