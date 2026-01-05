import React, { useState, useMemo } from 'react';
import { Dataset } from '../types';
import { generateDatasetInsight } from '../services/geminiService';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, BarChart2, Building2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

interface AIInsightProps {
  datasets: Dataset[];
}

export const AIInsight: React.FC<AIInsightProps> = ({ datasets }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<'sector' | 'producer'>('sector');

    // Aggregate Data for Charts
    const chartData = useMemo(() => {
        const processData = (key: 'sector' | 'producer') => {
            const counts: Record<string, number> = {};
            datasets.forEach(d => {
                const val = d[key] ? d[key].trim() : 'Unspecified';
                // Simplify long producer names for chart readability
                const label = val.length > 20 ? val.substring(0, 20) + '...' : val;
                counts[label] = (counts[label] || 0) + 1;
            });
            
            return Object.entries(counts)
                .map(([name, value]) => ({ name, value, full: name }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 10); // Top 10 only
        };

        return {
            sector: processData('sector'),
            producer: processData('producer')
        };
    }, [datasets]);

    const handleGenerate = async () => {
        setLoading(true);
        setInsight('');
        
        const context = datasets.map(d => 
            `- Title: ${d.name}\n  Producer: ${d.producer}\n  Sector: ${d.sector}\n`
        ).join('\n');

        await generateDatasetInsight(context, (chunk) => {
            setInsight(prev => prev + chunk);
        });
        setLoading(false);
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#64748b'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
                <div className="flex items-center text-white gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm md:text-base leading-tight">Dashboard & Analisis Cerdas</h3>
                        <p className="text-[10px] md:text-xs text-indigo-100 font-medium opacity-90">Visualisasi tren dan wawasan otomatis</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                    >
                        {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            
            {!collapsed && (
                <div className="p-4 md:p-6 animate-in fade-in duration-500">
                    {/* Tabs - Now wrapping and better spacing */}
                    <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-100 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('sector')}
                            className={`flex items-center gap-2 pb-3 px-2 text-xs md:text-sm font-bold transition-all ${
                                activeTab === 'sector' 
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <BarChart2 className="w-4 h-4" />
                            Distribusi Sektor
                        </button>
                        <button
                            onClick={() => setActiveTab('producer')}
                            className={`flex items-center gap-2 pb-3 px-2 text-xs md:text-sm font-bold transition-all ${
                                activeTab === 'producer' 
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <Building2 className="w-4 h-4" />
                            Top Produsen
                        </button>
                    </div>

                    {/* Charts Area */}
                    <div className="h-64 sm:h-72 md:h-80 w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData[activeTab]}
                                margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    interval={0} 
                                    height={60} 
                                    tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 500}} 
                                    stroke="transparent"
                                />
                                <YAxis tick={{fontSize: 10, fill: '#9ca3af'}} stroke="transparent" />
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        fontSize: '12px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                    cursor={{fill: '#f8fafc'}}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                                    {chartData[activeTab].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* AI Text Analysis Section */}
                    <div className="bg-slate-50 dark:bg-gray-900/30 rounded-2xl p-5 border border-slate-100 dark:border-gray-700/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                            <h4 className="text-[10px] md:text-xs font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                                Analisis Mendalam (AI)
                            </h4>
                            {!insight && !loading && (
                                <button 
                                    onClick={handleGenerate}
                                    className="text-xs flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all shadow-sm font-bold"
                                >
                                    <Sparkles className="w-3.5 h-3.5" /> Buat Ringkasan Eksekutif
                                </button>
                            )}
                            {(insight || loading) && (
                                 <button 
                                    onClick={handleGenerate}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-center gap-2 text-xs font-bold"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Perbarui Analisis
                                </button>
                            )}
                        </div>

                        {loading && !insight ? (
                            <div className="animate-pulse space-y-3 py-4">
                                <div className="h-2.5 bg-slate-200 dark:bg-gray-700 rounded-full w-full"></div>
                                <div className="h-2.5 bg-slate-200 dark:bg-gray-700 rounded-full w-11/12"></div>
                                <div className="h-2.5 bg-slate-200 dark:bg-gray-700 rounded-full w-4/5"></div>
                            </div>
                        ) : insight ? (
                             <div className="prose dark:prose-invert max-w-none prose-xs sm:prose-sm prose-indigo prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400 prose-headings:font-black prose-p:text-slate-600 dark:prose-p:text-gray-300">
                                <ReactMarkdown>{insight}</ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 italic font-medium py-2">
                                Klik "Buat Ringkasan Eksekutif" untuk meminta AI menganalisis tren data dan memberikan rekomendasi kebijakan berdasarkan katalog saat ini.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};