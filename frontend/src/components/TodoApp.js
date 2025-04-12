import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  // Fetch todos on mount and user change
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/todos', {
          withCredentials: true
        });
        setTodos(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchTodos();
  }, [user]);

  const addTodo = async () => {
    if (!text.trim() || loading) return;
    
    try {
      setLoading(true);
      const response = await axios.post('/api/todos', 
        { text },
        { withCredentials: true }
      );
      setTodos(prev => [...prev, response.data]);
      setText('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/todos/${id}`, { withCredentials: true });
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    try {
      setLoading(true);
      const todo = todos.find(t => t._id === id);
      const res = await axios.patch(
        `/api/todos/${id}`,
        { completed: !todo.completed },
        { withCredentials: true }
      );
      setTodos(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>My Todo List</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && (
        <div className="error-alert">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="filter-buttons">
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            disabled={loading}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="add-todo">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add new todo"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          disabled={loading}
        />
        <button 
          onClick={addTodo}
          disabled={loading || !text.trim()}
          className="add-btn"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {loading && <div className="loading-spinner"></div>}

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span>{todo.text}</span>
            <div className="todo-actions">
              <button
                onClick={() => toggleComplete(todo._id)}
                disabled={loading}
                className={`action-btn ${todo.completed ? 'undo' : 'complete'}`}
              >
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => deleteTodo(todo._id)}
                disabled={loading}
                className="action-btn delete"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;