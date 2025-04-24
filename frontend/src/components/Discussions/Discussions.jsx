import React, { useState, useEffect, useRef } from 'react'
import './Discussions.css'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { getSocket, initSocket, connectSocket } from '../../socket';
import { useAuth } from '../../context/AuthContext';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Discussions = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState({
        message: "",
        file: null
    })
    const [onlineCount, setOnlineCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [previewURL, setPreviewURL] = useState(null);

    const getPublicMessages = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/api/messages/public`, { withCredentials: true });
            setMessages(response.data);
        } catch (err) {
            console.log(err.response?.data.message || "Something went wrong");
        }
    }

    useEffect(() => {
        initSocket();
        connectSocket();
        const socket = getSocket();
        socket.emit("join", user._id);
        getPublicMessages();

        socket.on('receiveMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socket.on("onlineUsers", (onlineUsers) => {
            setOnlineCount(onlineUsers.length);
        })
        
        return () => {
            socket.off("receiveMessage");
            socket.off("onlineUsers");
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setMessage(prev => ({
            ...prev, [name]: value
        }));
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
            'application/pdf', 'text/plain',
            'video/mp4', 'video/webm'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Unsupported file type.");
            return;
        }

        if (file.size > maxSize) {
            alert("File too large. Max 5MB allowed.");
            return;
        }

        setMessage(prev => ({
            ...prev, file: file
        }));
        setPreviewURL(URL.createObjectURL(file));
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!message.message.trim() && !message.file) {
            alert("Please enter a message or upload a file.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('message', message.message);
            if (message.file) formData.append('file', message.file);

            const response = await axios.post(`${VITE_API_URL}/api/messages/public`,
                formData,
                { withCredentials: true });

            const newMsg = response.data;

            const socket = getSocket();
            socket.emit("sendMessage", newMsg);
            setMessage({
                message: "",
                file: null
            });
            setPreviewURL(null);

        } catch (err) {
            console.log(err.response?.data.message || "Something went wrong");
        }
    }

    return (
        <main id='discussions'>
            <div id='discussions-container'>
                <div className='discussions-header'>
                    <h1>Wanna Have A Discussion ?</h1>
                    <div className='online-users'>
                        <span className="online-counter">
                            {onlineCount} user{onlineCount === 1 ? "" : "s"} online
                        </span>
                        <span className='public-green-dot' />
                    </div>
                </div>
                <div className='discussions-content'>
                    {messages.map((msg) => (
                        <div className={`public-msg-card ${msg.senderId?._id === user._id ? "own-message" : ""}`}
                            key={msg._id}>
                            <img 
                                src={`${msg.senderId?.profilePhoto}`}
                                alt="user-image"
                                crossOrigin='anonymous'
                                onError={(e) => e.target.src ='./user.jpg'}
                            />
                            <div className='public-msg-bubble'>
                                {msg.file && (
                                    <div className='public-msg-file-preview'>
                                        {
                                            msg.file.endsWith('.jpg') ||
                                            msg.file.endsWith('.jpeg') ||
                                            msg.file.endsWith('.png') ||
                                            msg.file.endsWith('.gif') ? (
                                                <a href={`${VITE_API_URL}/uploads/${msg.file}`}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                ><img 
                                                    src={`${VITE_API_URL}/uploads/${msg.file}`}
                                                    alt='uploaded-img'
                                                    className='public-msg-image'
                                                    crossOrigin='anonymous' 
                                                    onError={(e) => e.target.src = './default.jpg'}
                                                />
                                                </a>
                                            ) : (
                                                <a href={`${VITE_API_URL}/uploads/${msg.file}`}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='public-msg-file-link'>
                                                    {msg.file}
                                                </a>
                                            )}
                                    </div>
                                )}
                                {msg.message && <p>{msg.message}</p>}
                                <span>
                                    {msg.senderId?._id === user._id ? "You" : msg.senderId?.username}
                                    {"  "}&#x2022;{" "}
                                    <small>
                                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                    </small>
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    {previewURL && <img src={previewURL} alt='preview' className='preview-image' />}
                </div>
                <div className='discussions-input'>
                    <form encType='multipart/form-data' onSubmit={submitHandler}>
                        <label htmlFor="input-file"><i className="ri-attachment-line"></i></label>
                        <input
                            id='input-file'
                            type="file"
                            name='file'
                            onChange={fileChangeHandler}
                        />
                        <input type="text"
                            name='message'
                            value={message.message}
                            onChange={changeHandler}
                            placeholder='Type a message...'
                        />
                        <button><i className="ri-send-plane-fill send"></i></button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Discussions