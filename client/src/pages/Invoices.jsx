import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Plus, Search, Calendar, DollarSign, FileText, ArrowRight, MoreHorizontal, Filter } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Invoices = () => {
    const { user } = useContext(AuthContext);
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        client: '',
        project: '',
        amount: '',
        dueDate: '',
        status: 'Pending'
    });

    useEffect(() => {
        fetchInvoices();
        fetchClients();
        fetchProjects();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/invoices');
            setInvoices(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/invoices', formData);
            fetchInvoices();
            setIsModalOpen(false);
            setFormData({
                client: '',
                project: '',
                amount: '',
                dueDate: '',
                status: 'Pending'
            });
        } catch (err) {
            console.error(err);
            alert('Failed to add invoice');
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.project?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice._id.includes(searchTerm)
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700';
            case 'Overdue': return 'bg-rose-100 text-rose-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Invoices</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Track payments and financial status of your projects.</p>
                </div>
                {user?.role === 'Admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                    >
                        <Plus size={18} />
                        <span>Create New Invoice</span>
                    </button>
                )}
            </header>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by client, project..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <Filter size={16} />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-[#fcfdfe]">
                            <tr>
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Invoice Details</th>
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Client / Project</th>
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Amount Due</th>
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Due Date</th>
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 divide-y divide-slate-100">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">INV-{invoice._id.slice(-6).toUpperCase()}</div>
                                                <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Recurring</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-800">{invoice.client?.name}</div>
                                        <div className="text-xs text-slate-400 font-medium">{invoice.project?.name || 'General Services'}</div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="text-sm font-black text-slate-800">{formatCurrency(invoice.amount)}</div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center text-xs text-slate-500 font-medium">
                                            <Calendar size={12} className="mr-1.5 text-slate-400" />
                                            {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusStyles(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-right">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredInvoices.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="mb-4 flex justify-center">
                                <FileText className="text-slate-200" size={48} />
                            </div>
                            <p className="text-slate-400 font-medium italic">No invoices found.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Generate New Invoice"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Client Selection</label>
                            <select name="client" value={formData.client} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans appearance-none bg-white">
                                <option value="">Select Client</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Related Project</label>
                            <select name="project" value={formData.project} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans appearance-none bg-white">
                                <option value="">Select Project (Optional)</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Total Amount</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-slate-400" size={16} />
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Due Date</label>
                            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Payment Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans appearance-none bg-white">
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-3 mt-4 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans flex items-center justify-center gap-2">
                        Generate & Save Invoice <ArrowRight size={18} />
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Invoices;
