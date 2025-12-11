
import React, { useState } from 'react';
import { Task } from '../types';
import { useLanguage } from '../i18n/index';
import Icon from '../components/Icon';
import { useData } from '../contexts/DataContext';

const TasksPage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [newTaskText, setNewTaskText] = useState('');
  const { t } = useLanguage();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    try {
      await addTask(newTaskText.trim());
      setNewTaskText('');
    } catch (error) {
      console.error("Failed to add task", error);
      alert("Error: Could not add task.");
    }
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        updateTask({ ...task, completed: !task.completed });
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
            <h2 className="text-2xl font-bold text-ui-text-primary mb-4 tracking-tight">{t('addNewTask')}</h2>
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder={t('taskPlaceholder')}
                    className="flex-1 p-4 bg-ui-card border-2 border-ui-border rounded-xl text-ui-text-primary placeholder-ui-text-secondary focus:ring-2 focus:ring-ui-primary focus:border-ui-primary focus:outline-none transition"
                />
                <button type="submit" className="bg-ui-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-80 transition-colors">
                    {t('addTask')}
                </button>
            </form>
        </div>
        
        <div className="bg-ui-card rounded-2xl shadow-apple overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-ui-text-primary tracking-tight">
                    {t('toDo')} ({incompleteTasks.length})
                </h2>
            </div>
            {incompleteTasks.length > 0 ? (
                <ul className="divide-y divide-ui-border">
                    {incompleteTasks.map(task => (
                        <li key={task.id} className="flex items-center px-6 py-4 group hover:bg-ui-hover transition-colors">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id)}
                                className="h-6 w-6 rounded-full border-gray-300 text-ui-primary focus:ring-ui-primary cursor-pointer"
                            />
                            <span className="ml-4 text-ui-text-primary flex-1 text-lg">{task.text}</span>
                            <button onClick={() => handleDeleteTask(task.id)} className="ml-4 p-2 text-ui-text-secondary hover:text-ui-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ui-red/10">
                                <Icon name="trash" className="w-5 h-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="px-6 pb-8 text-ui-text-secondary italic text-lg">{t('noPendingTasks')}</p>
            )}
        </div>

        {completedTasks.length > 0 && (
            <div className="bg-ui-card rounded-2xl shadow-apple overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-ui-text-primary tracking-tight">
                        {t('completed')} ({completedTasks.length})
                    </h2>
                </div>
                <ul className="divide-y divide-ui-border">
                    {completedTasks.map(task => (
                        <li key={task.id} className="flex items-center px-6 py-4 group bg-green-50">
                             <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id)}
                                className="h-6 w-6 rounded-full border-gray-300 text-ui-primary focus:ring-ui-primary cursor-pointer"
                            />
                            <span className="ml-4 text-ui-text-secondary line-through flex-1 text-lg">{task.text}</span>
                             <button onClick={() => handleDeleteTask(task.id)} className="ml-4 p-2 text-ui-text-secondary hover:text-ui-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ui-red/10">
                                <Icon name="trash" className="w-5 h-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};

export default TasksPage;
