import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        project: '',
        assignedTo: '',
        dueDate: '',
        status: 'Pending'
    });

    useEffect(() => {
        fetchTasks();
        fetchProjects();
        fetchInterns();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
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

    const fetchInterns = async () => {
        try {
            const res = await api.get('/users/interns');
            setInterns(res.data);
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
            const res = await api.post('/tasks', formData);
            // Re-fetch to populate
            fetchTasks();
            setIsModalOpen(false);
            setFormData({
                name: '',
                description: '',
                project: '',
                assignedTo: '',
                dueDate: '',
                status: 'Pending'
            });
        } catch (err) {
            console.error(err);
            alert('Failed to add task');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <Plus size={20} />
                    <span>Add Task</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <div key={task._id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{task.name}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {task.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{task.description}</p>

                        <div className="text-sm text-gray-500 space-y-1">
                            <p><span className="font-semibold">Project:</span> {task.project?.name}</p>
                            <p><span className="font-semibold">Assigned To:</span> {task.assignedTo?.name}</p>
                            <p><span className="font-semibold">Due:</span> {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            {tasks.length === 0 && (
                <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">No tasks found.</div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Task"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Task Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project</label>
                        <select name="project" value={formData.project} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="">Select Project</option>
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign To (Intern)</label>
                        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="">Select Intern (Optional)</option>
                            {interns.map(intern => (
                                <option key={intern._id} value={intern._id}>{intern.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Add Task
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
