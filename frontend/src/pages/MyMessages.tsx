import { useEffect, useState } from 'react';
import { getMyMessages, sendMessage } from '../api/messages';

interface Message {
    id: number;
    user_id: number;
    username: string;
    message: string;
    reply: string | null;
    is_read: boolean;
    created_at: string;
}

const MyMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const loadMessages = async () => {
        try {
            const res = await getMyMessages();
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await sendMessage(newMessage);
            setNewMessage('');
            loadMessages();
        } catch (err) {
            alert('Failed to send message');
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Contact Administrator</h2>
            <form onSubmit={handleSend} style={{ marginBottom: '2rem' }}>
                <textarea
                    rows={4}
                    placeholder="Write your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                    required
                />
                <button type="submit">Send Message</button>
            </form>

            <h3>Your Messages</h3>
            {messages.length === 0 && <p>No messages yet.</p>}
            {messages.map(msg => (
                <div key={msg.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
                    <p><strong>You:</strong> {msg.message}</p>
                    {msg.reply ? (
                        <p><strong>Admin reply:</strong> {msg.reply}</p>
                    ) : (
                        <p><em>Waiting for reply...</em></p>
                    )}
                    <small>{new Date(msg.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
};

export default MyMessages;