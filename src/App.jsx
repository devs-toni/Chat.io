import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:3101');

function App() {

  const [message, setMessage] = useState('second');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const receiveMessage = data => {
      setMessages([data, ...messages])
    }

    socket.on('message', receiveMessage);
    return () => {
      socket.off('message', receiveMessage);
    }
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    const newMessage = {
      body: message,
      from: 'me'
    }
    setMessages([newMessage, ...messages]);
    setMessage('');
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
        <button>Send</button>
      </form>

      {messages.map((m, index) => {
        return (
          <div key={index}>
            <p>{m.from}: {m.body}</p>
          </div>
        )
      })}
    </div>
  );
};

export default App
