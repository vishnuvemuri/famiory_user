import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CheckCircle, Clock, Plus, ArrowLeft, Search, Filter } from 'lucide-react';
import './WeddingTaskDelegation.css';

export interface Task {
  id: number;
  name: string;
  description?: string;
  section: 'pre-wedding' | 'wedding-day' | 'post-wedding';
  subcategory: string;
  assignee: string;
  status: 'not-started' | 'in-progress' | 'completed';
  dueDate: string;
}

interface WeddingTaskDelegationProps {
  // API integration props - your backend developer can implement these
  onFetchTasks?: () => Promise<Task[]>;
  onCreateTask?: (task: Omit<Task, 'id'>) => Promise<Task>;
  onUpdateTask?: (id: number, task: Partial<Task>) => Promise<Task>;
  onDeleteTask?: (id: number) => Promise<void>;
  initialTasks?: Task[];
}

export const WeddingTaskDelegation: React.FC<WeddingTaskDelegationProps> = ({
  onFetchTasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  initialTasks = []
}) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({
    section: 'all',
    subcategory: 'all',
    assignee: 'all',
    status: 'all',
    dueDate: '',
    search: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const subcategories = {
    'pre-wedding': ['planning-and-budgeting', 'venue-and-vendor-bookings', 'shopping', 'invitations', 'pre-wedding-rituals'],
    'wedding-day': ['venue-and-decor', 'catering-and-food', 'photography-and-videography', 'music-and-entertainment', 'wedding-rituals'],
    'post-wedding': ['reception', 'logistics-and-coordination', 'miscellaneous', 'post-wedding-follow-up']
  };

  const assigneeOptions = ['Parents', 'Wedding Planner', 'Brother', 'Sister', 'Bride & Groom', 'Family Member', 'Friend'];

  // API Integration - Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      if (onFetchTasks) {
        try {
          const fetchedTasks = await onFetchTasks();
          setTasks(fetchedTasks);
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
      }
    };
    loadTasks();
  }, [onFetchTasks]);

  // Apply filters whenever tasks or filters change
  useEffect(() => {
    let filtered = [...tasks];

    if (filters.section !== 'all') {
      filtered = filtered.filter(task => task.section === filters.section);
    }
    if (filters.subcategory !== 'all') {
      filtered = filtered.filter(task => task.subcategory === filters.subcategory);
    }
    if (filters.assignee !== 'all') {
      filtered = filtered.filter(task => task.assignee === filters.assignee);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    if (filters.dueDate) {
      filtered = filtered.filter(task => task.dueDate === filters.dueDate);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm)) ||
        task.assignee.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatSubcategoryText = (subcategory: string) => {
    return subcategory.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatSectionText = (section: string) => {
    return section.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getTaskCounts = () => {
    return {
      total: filteredTasks.length,
      preWedding: filteredTasks.filter(t => t.section === 'pre-wedding').length,
      weddingDay: filteredTasks.filter(t => t.section === 'wedding-day').length,
      postWedding: filteredTasks.filter(t => t.section === 'post-wedding').length
    };
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      if (onCreateTask) {
        const newTask = await onCreateTask(taskData);
        setTasks(prev => [...prev, newTask]);
      } else {
        // Fallback for demo - generate local ID
        const newTask: Task = {
          ...taskData,
          id: Date.now()
        };
        setTasks(prev => [...prev, newTask]);
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    try {
      if (onUpdateTask) {
        const updatedTask = await onUpdateTask(id, updates);
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      } else {
        // Fallback for demo
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ));
      }
      setShowEditModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      if (onDeleteTask) {
        await onDeleteTask(id);
      }
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  const counts = getTaskCounts();

  return (
    <div className="wedding-task-delegation">
      <div className="main-container">
        {/* Page Header */}
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1>Wedding Task Delegation</h1>
          <p>Assign and track all wedding-related tasks with your team. Filter by category, assignee, or status to stay organized.</p>
        </div>

        {/* Overview Cards */}
        <div className="responsibility-overview">
          <OverviewCard 
            icon={<CheckCircle />} 
            title="Total Tasks" 
            value={counts.total} 
            label="Across all categories" 
          />
          <OverviewCard 
            icon={<Calendar />} 
            title="Pre-Wedding" 
            value={counts.preWedding} 
            label="Planning tasks" 
          />
          <OverviewCard 
            icon={<Users />} 
            title="Wedding Day" 
            value={counts.weddingDay} 
            label="Ceremony tasks" 
          />
          <OverviewCard 
            icon={<Clock />} 
            title="Post-Wedding" 
            value={counts.postWedding} 
            label="Reception tasks" 
          />
        </div>

        {/* Filters */}
        <TaskFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          subcategories={subcategories}
          assigneeOptions={assigneeOptions}
        />

        {/* Task Grid */}
        <div className="task-grid-container">
          <div className="section-header">
            <h2>Assigned Tasks</h2>
            <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Task
            </button>
          </div>
          
          <div className="task-grid">
            {filteredTasks.length === 0 ? (
              <div className="no-tasks">No tasks found matching your filters.</div>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isOverdue={isOverdue(task.dueDate, task.status)}
                  onEdit={() => {
                    setEditingTask(task);
                    setShowEditModal(true);
                  }}
                  onDelete={() => handleDeleteTask(task.id)}
                  formatSubcategoryText={formatSubcategoryText}
                  formatSectionText={formatSectionText}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <TaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateTask}
          subcategories={subcategories}
          assigneeOptions={assigneeOptions}
          title="Add New Task"
        />
      )}

      {showEditModal && editingTask && (
        <TaskModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingTask(null);
          }}
          onSubmit={(taskData) => handleUpdateTask(editingTask.id, taskData)}
          subcategories={subcategories}
          assigneeOptions={assigneeOptions}
          title="Edit Task"
          initialData={editingTask}
        />
      )}
    </div>
  );
};

// Overview Card Component
interface OverviewCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  label: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ icon, title, value, label }) => (
  <div className="overview-card">
    <div className="overview-icon">{icon}</div>
    <div className="overview-title">{title}</div>
    <div className="overview-value">{value}</div>
    <div className="overview-label">{label}</div>
  </div>
);

// Task Filters Component
interface TaskFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: string) => void;
  subcategories: Record<string, string[]>;
  assigneeOptions: string[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  subcategories, 
  assigneeOptions 
}) => {
  const getSubcategoryOptions = () => {
    if (filters.section === 'all') return [];
    return subcategories[filters.section as keyof typeof subcategories] || [];
  };

  return (
    <div className="task-filters">
      <div className="filter-row">
        <div className="filter-group">
          <label>Section</label>
          <select 
            value={filters.section} 
            onChange={(e) => onFilterChange('section', e.target.value)}
          >
            <option value="all">All Sections</option>
            <option value="pre-wedding">Pre-Wedding</option>
            <option value="wedding-day">Wedding Day</option>
            <option value="post-wedding">Post-Wedding</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Subcategory</label>
          <select 
            value={filters.subcategory} 
            onChange={(e) => onFilterChange('subcategory', e.target.value)}
          >
            <option value="all">All Subcategories</option>
            {getSubcategoryOptions().map(sub => (
              <option key={sub} value={sub}>
                {sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Assignee</label>
          <select 
            value={filters.assignee} 
            onChange={(e) => onFilterChange('assignee', e.target.value)}
          >
            <option value="all">All Assignees</option>
            {assigneeOptions.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={filters.status} 
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Due Date</label>
          <input 
            type="date" 
            value={filters.dueDate}
            onChange={(e) => onFilterChange('dueDate', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Search</label>
          <input 
            type="text" 
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  isOverdue: boolean;
  onEdit: () => void;
  onDelete: () => void;
  formatSubcategoryText: (text: string) => string;
  formatSectionText: (text: string) => string;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isOverdue, 
  onEdit, 
  onDelete, 
  formatSubcategoryText, 
  formatSectionText 
}) => {
  const dueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-due-date">
        <Calendar size={12} />
        {dueDate}
      </div>
      
      <h3>{task.name}</h3>
      {task.description && <p>{task.description}</p>}
      
      <p className="task-section">{formatSectionText(task.section)}</p>
      <p className="task-subcategory">{formatSubcategoryText(task.subcategory)}</p>
      
      <div className="task-assignee">
        <Users size={14} />
        {task.assignee}
      </div>
      
      <div className={`task-status status-${task.status}`}>
        {task.status.replace('-', ' ').toUpperCase()}
      </div>
      
      <div className="task-actions">
        <button className="task-btn edit-task" onClick={onEdit}>
          ✏️
        </button>
        <button className="task-btn delete delete-task" onClick={onDelete}>
          🗑️
        </button>
      </div>
    </div>
  );
};

// Task Modal Component
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  subcategories: Record<string, string[]>;
  assigneeOptions: string[];
  title: string;
  initialData?: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subcategories,
  assigneeOptions,
  title,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    section: initialData?.section || 'pre-wedding',
    subcategory: initialData?.subcategory || '',
    assignee: initialData?.assignee || '',
    status: initialData?.status || 'not-started',
    dueDate: initialData?.dueDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Task, 'id'>);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSubcategoryOptions = () => {
    return subcategories[formData.section as keyof typeof subcategories] || [];
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter task details"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Section</label>
              <select
                required
                value={formData.section}
                onChange={(e) => handleChange('section', e.target.value)}
              >
                <option value="pre-wedding">Pre-Wedding</option>
                <option value="wedding-day">Wedding Day</option>
                <option value="post-wedding">Post-Wedding</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Subcategory</label>
              <select
                required
                value={formData.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select subcategory</option>
                {getSubcategoryOptions().map(sub => (
                  <option key={sub} value={sub}>
                    {sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Assignee</label>
              <select
                required
                value={formData.assignee}
                onChange={(e) => handleChange('assignee', e.target.value)}
              >
                <option value="">Select assignee</option>
                {assigneeOptions.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeddingTaskDelegation;