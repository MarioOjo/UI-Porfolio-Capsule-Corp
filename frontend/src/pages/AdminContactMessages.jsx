import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get('/api/contact')
      .then(res => setMessages(res.data.messages))
      .finally(() => setLoading(false));
  }, []);

  const handleResend = async (id) => {
    setResendStatus({ ...resendStatus, [id]: 'sending' });
    try {
      await axios.post(`/api/contact/${id}/resend`);
      setResendStatus({ ...resendStatus, [id]: 'success' });
    } catch {
      setResendStatus({ ...resendStatus, [id]: 'error' });
    }
  };

  return (
    <div>
      <h2>Contact Messages (Admin)</h2>
      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td>{msg.status}</td>
                <td>{new Date(msg.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleResend(msg.id)}>
                    Resend
                  </button>
                  {resendStatus[msg.id] === 'sending' && <span>Sending...</span>}
                  {resendStatus[msg.id] === 'success' && <span>✔️ Sent</span>}
                  {resendStatus[msg.id] === 'error' && <span>❌ Error</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminContactMessages;
