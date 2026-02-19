import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            const res = await api.post('/invoices', formData);
            // Re-fetch to populate references
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Invoices</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <Plus size={20} />
                    <span>Add Invoice</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{invoice._id.slice(-6)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{invoice.client?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{invoice.project?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">${invoice.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                            invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {invoices.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No invoices found.</div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Invoice"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Client</label>
                        <select name="client" value={formData.client} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="">Select Client</option>
                            {clients.map(client => (
                                <option key={client._id} value={client._id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project</label>
                        <select name="project" value={formData.project} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="">Select Project (Optional)</option>
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Add Invoice
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Invoices;
