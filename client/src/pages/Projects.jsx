import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Not Started'
    });

    useEffect(() => {
        fetchProjects();
        fetchClients();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/projects', formData);
            // Re-fetch projects to get the populated client data correctly
            fetchProjects();
            setIsModalOpen(false);
            setFormData({
                name: '',
                client: '',
                description: '',
                startDate: '',
                endDate: '',
                status: 'Not Started'
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to add project');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Projects</h1>
                {user?.role === 'Admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        <span>Add Project</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold">{project.name}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-500 mb-2">{project.client?.name}</p>
                        <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                            <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
            {projects.length === 0 && (
                <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">No projects found.</div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Project"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
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
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Add Project
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
