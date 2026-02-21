import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
    const { user } = useContext(AuthContext);
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
        status: 'Pending',
        priority: 'Medium'
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

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to update status');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/tasks', formData);
            fetchTasks();
            setIsModalOpen(false);
            setFormData({
                name: '',
                description: '',
                project: '',
                assignedTo: '',
                dueDate: '',
                status: 'Pending',
                priority: 'Medium'
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to add task');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'Low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const canUpdateStatus = (task) => {
        if (user?.role === 'Admin') return true;
        return task.assignedTo?._id === user?.id;
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading tasks...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Task Management</h1>
                {user?.role === 'Admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        <span>Create Task</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <div key={task._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold">{task.name}</h3>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

                            <div className="text-sm text-gray-500 space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Project:</span>
                                    <span>{task.project?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Priority:</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(task.priority)}`}>
                                        {task.priority || 'Medium'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Assigned To:</span>
                                    <span>{task.assignedTo?.name || 'Unassigned'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Due:</span>
                                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t flex justify-end space-x-2">
                            {canUpdateStatus(task) && (
                                <>
                                    {task.status !== 'Completed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(task._id, 'Completed')}
                                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                        >
                                            Done
                                        </button>
                                    )}
                                    {task.status === 'Pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(task._id, 'In Progress')}
                                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                        >
                                            Start
                                        </button>
                                    )}
                                    {task.status === 'In Progress' && (
                                        <button
                                            onClick={() => handleStatusUpdate(task._id, 'On Hold')}
                                            className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                                        >
                                            Hold
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {tasks.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-white rounded-lg shadow">
                    <p className="text-xl font-medium">No tasks found</p>
                    <p className="text-sm">Get started by creating your first task.</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Task"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                            <select name="project" value={formData.project} onChange={handleChange} required className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select Project</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (Intern)</label>
                        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Intern (Optional)</option>
                            {interns.map(intern => (
                                <option key={intern._id} value={intern._id}>{intern.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold shadow hover:bg-blue-700 transition">
                        Create Task
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
