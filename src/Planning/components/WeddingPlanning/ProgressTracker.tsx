import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Edit, Trash2, Plus, ExternalLink } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'working' | 'completed';
  section: string;
}

interface ProgressTrackerProps {
  onBack?: () => void;
  onTaskCreate?: (task: Omit<Task, 'id'>) => Promise<{ id: string }>;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete?: (taskId: string) => Promise<void>;
  onTasksLoad?: () => Promise<Task[]>;
  initialTasks?: Task[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  onBack,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTasksLoad,
  initialTasks = []
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const sections = [
    { id: 'venue', title: 'Venue & Logistics', color: '#d4af37' },
    { id: 'attire', title: 'Attire & Beauty', color: '#e67e22' },
    { id: 'vendors', title: 'Vendors & Services', color: '#27ae60' },
    { id: 'guests', title: 'Guest Management', color: '#e74c3c' }
  ];

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (onTasksLoad) {
          const loadedTasks = await onTasksLoad();
          setTasks(loadedTasks);
        } else {
          setTasks(initialTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    
    loadTasks();
  }, [onTasksLoad, initialTasks]);

  // Calculate progress statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get section progress
  const getSectionProgress = (sectionId: string) => {
    const sectionTasks = tasks.filter(task => task.section === sectionId);
    const sectionCompleted = sectionTasks.filter(task => task.status === 'completed').length;
    return sectionTasks.length > 0 ? Math.round((sectionCompleted / sectionTasks.length) * 100) : 0;
  };

  // Handle task status toggle
  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: 'pending' | 'working' | 'completed';
    let completedDate: string | undefined;

    switch (task.status) {
      case 'pending':
        newStatus = 'working';
        break;
      case 'working':
        newStatus = 'completed';
        completedDate = new Date().toISOString().split('T')[0];
        break;
      case 'completed':
        newStatus = 'pending';
        completedDate = undefined;
        break;
    }

    try {
      if (onTaskUpdate) {
        await onTaskUpdate(taskId, { status: newStatus, completedDate });
      }
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: newStatus, completedDate }
          : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle task creation/update
  const handleTaskSubmit = async () => {
    if (!formData.title.trim() || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: formData.dueDate,
      priority: formData.priority,
      section: currentSection,
      status: 'pending' as const
    };

    try {
      if (editingTask) {
        // Update existing task
        if (onTaskUpdate) {
          await onTaskUpdate(editingTask.id, taskData);
        }
        
        setTasks(prev => prev.map(t => 
          t.id === editingTask.id 
            ? { ...t, ...taskData }
            : t
        ));
      } else {
        // Create new task
        let newTaskId = Date.now().toString();
        
        if (onTaskCreate) {
          const result = await onTaskCreate(taskData);
          newTaskId = result.id;
        }
        
        const newTask: Task = {
          id: newTaskId,
          ...taskData
        };
        
        setTasks(prev => [...prev, newTask]);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  // Handle task deletion
  const handleTaskDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      if (onTaskDelete) {
        await onTaskDelete(taskId);
      }
      
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Open modal for new task
  const openAddTaskModal = (sectionId: string) => {
    setCurrentSection(sectionId);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
    setShowModal(true);
  };

  // Open modal for editing task
  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setCurrentSection(task.section);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate,
      priority: task.priority
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setCurrentSection('');
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#f39c12';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <i className="fas fa-check text-white" />;
      case 'working':
        return <i className="fas fa-spinner fa-pulse text-amber-600" />;
      default:
        return <i className="fas fa-exclamation text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-white/95 backdrop-blur-sm shadow-sm">
        <a 
          href="https://www.famiory.com" 
          className="text-3xl font-serif font-bold text-amber-900 hover:text-amber-700 transition-colors"
        >
          Famiory
        </a>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-white/96 backdrop-blur-sm rounded-2xl shadow-xl p-10 min-h-[75vh]">
          
          {/* Page Header */}
          <div className="text-center mb-10 relative">
            <button
              onClick={onBack || (() => window.history.back())}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-800 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            
            <h1 className="text-5xl font-serif font-medium text-amber-900 mb-4">
              Wedding Progress Tracker
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Keep track of all your wedding planning tasks and monitor your overall progress. 
              Mark items as complete as you go!
            </p>
          </div>

          {/* Progress Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
              <h3 className="text-xl font-serif text-amber-900 mb-4">Overall Progress</h3>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${overallProgress}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-900">{overallProgress}%</span>
                </div>
              </div>
              <p className="text-amber-700 font-medium">On Track</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
              <h3 className="text-xl font-serif text-amber-900 mb-4">Completed Tasks</h3>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-green-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${overallProgress}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-900">{completedTasks}</span>
                </div>
              </div>
              <p className="text-amber-700 font-medium">Out of {totalTasks}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
              <h3 className="text-xl font-serif text-amber-900 mb-4">Pending Tasks</h3>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-orange-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${100 - overallProgress}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-900">{pendingTasks}</span>
                </div>
              </div>
              <p className="text-amber-700 font-medium">To Complete</p>
            </div>
          </div>

          {/* Checklist Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sections.map((section) => {
              const sectionTasks = tasks.filter(task => task.section === section.id);
              const sectionProgress = getSectionProgress(section.id);
              
              return (
                <div key={section.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-serif text-amber-900">{section.title}</h2>
                    <span className="text-amber-600 font-medium">{sectionProgress}% Complete</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    {sectionTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-600">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        />
                        
                        <button
                          onClick={() => handleTaskToggle(task.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                            task.status === 'completed' 
                              ? 'bg-green-500 border-green-500' 
                              : task.status === 'working'
                              ? 'bg-amber-100 border-amber-500'
                              : 'border-gray-300 hover:border-amber-500'
                          }`}
                        >
                          {getStatusIcon(task.status)}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-amber-900 ${task.status === 'completed' ? 'line-through opacity-70' : ''}`}>
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                          )}
                          <div className="flex items-center text-xs text-gray-500 mt-2">
                            <Calendar size={12} className="mr-1" />
                            {task.status === 'completed' && task.completedDate 
                              ? `Completed: ${formatDate(task.completedDate)}`
                              : `Due: ${formatDate(task.dueDate)}`
                            }
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => openEditTaskModal(task)}
                            className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleTaskDelete(task.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => openAddTaskModal(section.id)}
                    className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-800 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Task
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-2xl font-serif text-amber-900">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <i className="fas fa-times text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add details about this task"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTaskSubmit}
                  className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-800 transition-all duration-200"
                >
                  {editingTask ? 'Update Task' : 'Save Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Famiory Link */}
      <a
        href="https://www.famiory.com"
        className="fixed bottom-6 right-6 bg-amber-600 text-white px-5 py-3 rounded-lg font-medium shadow-lg hover:bg-amber-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 z-40"
      >
        Back to Famiory
        <ExternalLink size={14} />
      </a>
    </div>
  );
};

export default ProgressTracker;