import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load todos on startup
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/todos');
        setTodos(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!text.trim() || loading) return;
    
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await axios.post('http://localhost:5000/api/todos', 
        { text },
        { 
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      clearTimeout(timeoutId);
      setTodos([...todos, response.data]);
      setText('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion status
  const toggleComplete = async (id) => {
    try {
      setLoading(true);
      const res = await axios.patch(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.map(todo => 
        todo._id === id ? res.data : todo
      ));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>My Todo List</h1>
      
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          margin: '10px 0',
          border: '1px solid red',
          borderRadius: '4px'
        }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{ marginLeft: '10px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Filter Buttons */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setFilter('all')}
          disabled={loading}
          style={{ 
            backgroundColor: filter === 'all' ? '#4CAF50' : '#f1f1f1',
            color: filter === 'all' ? 'white' : 'black',
            opacity: loading ? 0.7 : 1
          }}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          disabled={loading}
          style={{ 
            backgroundColor: filter === 'active' ? '#4CAF50' : '#f1f1f1',
            color: filter === 'active' ? 'white' : 'black',
            opacity: loading ? 0.7 : 1
          }}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          disabled={loading}
          style={{ 
            backgroundColor: filter === 'completed' ? '#4CAF50' : '#f1f1f1',
            color: filter === 'completed' ? 'white' : 'black',
            opacity: loading ? 0.7 : 1
          }}
        >
          Completed
        </button>
      </div>

      {/* Add Todo Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add new todo"
          style={{ flex: 1, padding: '8px' }}
          onKeyPress={(e) => e.key === 'Enter' && !loading && addTodo()}
          disabled={loading}
        />
        <button 
          onClick={addTodo}
          disabled={loading || !text.trim()}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none',
            opacity: (loading || !text.trim()) ? 0.7 : 1
          }}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {/* Loading indicator */}
      {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}

      {/* Todo List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li 
            key={todo._id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px'
            }}
          >
            <span 
              style={{ 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#888' : 'inherit'
              }}
            >
              {todo.text} {/* THIS IS THE CRITICAL ADDITION */}
            </span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button 
                onClick={() => !loading && toggleComplete(todo._id)}
                disabled={loading}
                style={{ 
                  backgroundColor: todo.completed ? '#ff9800' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button 
                onClick={() => !loading && deleteTodo(todo._id)}
                disabled={loading}
                style={{ 
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;