import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Plus, Search, Mail, Phone, Building2, MapPin, MoreHorizontal } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Clients = () => {
    const { user } = useContext(AuthContext);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        address: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/clients', formData);
            setClients([res.data, ...clients]);
            setIsModalOpen(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                companyName: '',
                address: '',
                status: 'Active'
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to add client');
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-vh-100 p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Clients</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Manage your agency relationships and contacts.</p>
                </div>
                {user?.role === 'Admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:translate-y-[-2px]"
                    >
                        <Plus size={18} />
                        <span>Add New Client</span>
                    </button>
                )}
            </header>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients by name, company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-[#fcfdfe]">
                            <tr>
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Client Information</th>
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Company Details</th>
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 divide-y divide-slate-100">
                            {filteredClients.map((client) => (
                                <tr key={client._id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">{client.name}</div>
                                                <div className="flex items-center text-xs text-slate-400 mt-1">
                                                    <Mail size={12} className="mr-1" /> {client.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex flex-col space-y-1">
                                            <div className="text-sm font-semibold text-slate-700 flex items-center">
                                                <Building2 size={14} className="mr-1.5 text-slate-400" /> {client.companyName}
                                            </div>
                                            <div className="text-xs text-slate-400 flex items-center">
                                                <Phone size={12} className="mr-1.5" /> {client.phone || 'No phone'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {client.status}
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
                    {filteredClients.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="mb-4 flex justify-center">
                                <Search className="text-slate-200" size={48} />
                            </div>
                            <p className="text-slate-400 font-medium italic">No clients matching your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Client"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="Full Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="email@example.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Company Name</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="Company" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans" placeholder="Street Address, City, Country" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">Client Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans appearance-none bg-white">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full mt-4 py-3 text-sm font-bold text-white premium-gradient rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans">
                        Confirm & Add Client
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
