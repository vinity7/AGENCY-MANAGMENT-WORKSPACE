import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Download, FileText, TrendingUp, Users, Briefcase, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Analytics = () => {
    const [productivityData, setProductivityData] = useState([]);
    const [revenueData, setRevenueData] = useState({});
    const [projectMetrics, setProjectMetrics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                console.log('Fetching analytics data...');
                const [prodRes, revRes, projRes] = await Promise.all([
                    api.get('/analytics/productivity'),
                    api.get('/analytics/revenue'),
                    api.get('/analytics/projects')
                ]);
                console.log('Analytics data received:', { prod: prodRes.data, rev: revRes.data, proj: projRes.data });
                setProductivityData(prodRes.data || []);
                setRevenueData(revRes.data || {});
                setProjectMetrics(projRes.data || {});
                setLoading(false);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                if (err.response) {
                    console.error('Response Status:', err.response.status);
                    console.error('Response Data:', err.response.data);
                }
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const exportPDF = () => {
        const doc = jsPDF();
        doc.setFontSize(20);
        doc.text('Agency Management Report', 20, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

        // Revenue Table
        doc.autoTable({
            startY: 40,
            head: [['Metric', 'Value']],
            body: [
                ['Total Paid Revenue', `$${revenueData.actual}`],
                ['Pending Revenue', `$${revenueData.pending}`],
                ['Projected Revenue', `$${revenueData.projected}`],
            ],
            theme: 'striped'
        });

        // Productivity Table
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Intern Name', 'Tasks Completed', 'Tasks Pending']],
            body: productivityData.map(d => [d.name, d.completed, d.pending]),
            theme: 'grid'
        });

        doc.save('Agency_Performance_Report.pdf');
    };

    const exportCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Intern Name,Tasks Completed,Tasks Pending\r\n";
        productivityData.forEach(row => {
            csvContent += `${row.name},${row.completed},${row.pending}\r\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "intern_productivity.csv");
        document.body.appendChild(link);
        link.click();
    };

    const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    // Transform project metrics for Pie Chart
    const pieData = [
        { name: 'Completed', value: projectMetrics.completed || 0 },
        { name: 'In Progress', value: projectMetrics.inProgress || 0 },
        { name: 'Delayed', value: projectMetrics.delayed || 0 },
        { name: 'Others', value: (projectMetrics.total || 0) - (projectMetrics.completed || 0) - (projectMetrics.inProgress || 0) }
    ].filter(d => d.value > 0);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Agency Analytics</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Data-driven insights into your agency's performance and growth.</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={exportCSV} className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} />
                        <span>Export CSV</span>
                    </button>
                    <button onClick={exportPDF} className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans">
                        <FileText size={16} />
                        <span>Download Report</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl flex items-center space-x-4 border-l-4 border-emerald-500">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Revenue</p>
                        <h3 className="text-2xl font-black text-slate-800">${revenueData.actual?.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center space-x-4 border-l-4 border-blue-500">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Projected Goal</p>
                        <h3 className="text-2xl font-black text-slate-800">${revenueData.projected?.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center space-x-4 border-l-4 border-rose-500">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Interns</p>
                        <h3 className="text-2xl font-black text-slate-800">{productivityData.length}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Productivity Chart */}
                <div className="glass-card p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Intern Productivity</h3>
                            <p className="text-xs text-slate-400 font-bold mt-1">TASKS COMPLETED VS. PENDING</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} name="Completed" />
                                <Bar dataKey="pending" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} name="Pending" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Project Pipeline Chart */}
                <div className="glass-card p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Project Pipeline</h3>
                            <p className="text-xs text-slate-400 font-bold mt-1">LIFECYCLE DISTRIBUTION</p>
                        </div>
                    </div>
                    <div className="h-80 w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black text-slate-800 tracking-tighter">{projectMetrics.total}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-8 rounded-2xl shadow-sm border border-slate-100 italic text-slate-500 text-sm text-center">
                <p>💡 Hint: Revenue projection includes all pending invoices. Use the "Download Report" button for a detailed breakdown.</p>
            </div>
        </div>
    );
};

export default Analytics;
