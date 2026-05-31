import { useEffect, useState } from 'react';
import { getAllMessages, replyMessage, deleteMessage } from '../api/messages';

interface Message {
    id: number;
    user_id: number;
    username: string;
    message: string;
    reply: string | null;
    is_read: boolean;
    created_at: string;
}

const AdminMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

    const loadMessages = async () => {
        try {
            const res = await getAllMessages();
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReply = async (id: number) => {
        const reply = replyText[id];
        if (!reply || reply.trim() === '') return;
        try {
            await replyMessage(id, reply);
            setReplyText(prev => ({ ...prev, [id]: '' }));
            loadMessages();
        } catch (err) {
            alert('Failed to send reply');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this message?')) return;
        try {
            await deleteMessage(id);
            loadMessages();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    return (
        <div>
            <h2>Manage User Messages</h2>
            {messages.length === 0 && <p>No messages.</p>}
            {messages.map(msg => (
                <div key={msg.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
                    <p><strong>From:</strong> {msg.username} (User ID: {msg.user_id})</p>
                    <p><strong>Message:</strong> {msg.message}</p>
                    <p><strong>Sent:</strong> {new Date(msg.created_at).toLocaleString()}</p>
                    {msg.reply && <p><strong>Reply sent:</strong> {msg.reply}</p>}
                    <div>
                        <textarea
                            rows={2}
                            placeholder="Write reply..."
                            value={replyText[msg.id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                            style={{ width: '80%', marginRight: '0.5rem' }}
                        />
                        <button onClick={() => handleReply(msg.id)}>Reply</button>
                        <button onClick={() => handleDelete(msg.id)} style={{ marginLeft: '0.5rem', background: '#ef4444' }}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminMessages;