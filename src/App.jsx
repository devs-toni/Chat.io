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
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className='text-2xl font-bold my-2'>Chat React</h1>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="border-2 border-zinc-500 p-2 text-black w-full"
        />

        <ul className='h-80 overflow-y-auto'>
          {messages.map((m, index) => {
            return (
              <li key={index} className={`my-2 p-2 table text-sm rounded-md ${m.from === 'me' ? 'bg-sky-700 ml-auto' : 'bg-black'}`}>
                {m.from}: {m.body}
              </li>
            )
          })}
        </ul>
      </form>


    </div>
  );
};

export default App
