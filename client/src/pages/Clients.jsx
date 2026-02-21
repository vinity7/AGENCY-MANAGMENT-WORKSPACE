import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Clients = () => {
    const { user } = useContext(AuthContext);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Clients</h1>
                {user?.role === 'Admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        <span>Add Client</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clients.map((client) => (
                            <tr key={client._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{client.companyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {client.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No clients found.</div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Client"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Add Client
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
