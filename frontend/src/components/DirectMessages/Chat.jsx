import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { initSocket, getSocket, connectSocket } from "../../socket";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Chat = ({ selectedUser, currentUser }) => {
    const [directMessage, setDirectMessage] = useState({
        message: "",
        file: null,
    });

    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [previewURL, setPreviewURL] = useState(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        initSocket();
        connectSocket();
        const socket = getSocket();

        if (currentUser) {
            socket.emit("join", currentUser._id);
        }

        socket.on("receivePrivateMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receivePrivateMessage");
        };
    }, [currentUser]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!selectedUser) return;
                const response = await axios.get(`${VITE_API_URL}/api/messages/dm/${selectedUser._id}`,
                    { withCredentials: true }
                );
                setMessages(response.data);
            } catch (err) {
                console.error(err.response?.data.message || "Failed to load messages");
            }
        };
        fetchMessages();
    }, [selectedUser]);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setDirectMessage((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "application/pdf",
            "text/plain",
            "video/mp4",
            "video/webm",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Unsupported file type.");
            return;
        }

        if (file.size > maxSize) {
            alert("File too large. Max 5MB allowed.");
            return;
        }

        setDirectMessage((prev) => ({
            ...prev,
            file,
        }));
        setPreviewURL(URL.createObjectURL(file));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!selectedUser || (!directMessage.message && !directMessage.file))
            return;

        const formData = new FormData();
        formData.append("message", directMessage.message);
        if (directMessage.file) {
            formData.append("file", directMessage.file);
        }
        try {
            const response = await axios.post(`${VITE_API_URL}/api/messages/dm/${selectedUser._id}`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            const sentMsg = response.data;
            setMessages((prev) => [...prev, sentMsg]);
            const socket = getSocket();
            socket.emit("privateMessage", {
                receiverId: selectedUser._id,
                message: sentMsg,
            });

            setDirectMessage({
                message: "",
                file: null,
            });
            setPreviewURL(null);
        } catch (err) {
            console.log(err.response?.data.message || "Something went wrong");
        }
    };

    return (
        <main id="chat">
            <div className="chat-header">
                <div className="selected-user-img">
                    {selectedUser ? (
                        <img 
                            src={`${selectedUser?.profilePhoto}`}
                            alt="profile-photo"
                            crossOrigin="anonymous" 
                            onError={(e) => e.target.src = './user.jpg'}    
                        />
                    ) : (
                        <h3>Select A User To Start Conversation!</h3>
                    )}
                </div>
                <div className="selected-username">
                    <h3>{selectedUser?.username}</h3>
                </div>
            </div>
            <div className="chat-content">
                {messages.map((msg) => {
                    const isSender = msg.senderId._id === currentUser?._id;
                    const isImage = msg.file && 
                        (msg.file.endsWith(".jpg") ||
                        msg.file.endsWith(".jpeg") ||
                        msg.file.endsWith(".png") ||
                        msg.file.endsWith(".gif"));

                    return (
                        <div className={`dm-msg-card ${isSender ? "own-message" : ""}`}
                            key={msg._id} >
                            <div className="dm-msg-bubble">
                                {msg.file && (
                                    <div className="dm-msg-file-preview">
                                        {isImage ? (
                                            <a href={`${VITE_API_URL}/uploads/${msg.file}`}
                                                target="_blank"
                                                rel="noreferrer" 
                                            >
                                                <img 
                                                    src={`${VITE_API_URL}/uploads/${msg.file}`}
                                                    alt="uploaded-img"
                                                    className="dm-msg-image"
                                                    crossOrigin="anonymous" 
                                                    onError={(e) => e.target.src = './default.jpg'}    
                                                />
                                            </a>
                                        ) : (
                                            <a href={`${VITE_API_URL}/uploads/${msg.file}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="dm-msg-file-link">
                                            {msg.file}
                                        </a>
                                    )}
                                </div>
                            )}
                            {msg.message && <p>{msg.message}</p>}
                            <span>
                                {isSender ? "You" : msg.senderId?.username} •{" "}
                                <small>
                                    {formatDistanceToNow(new Date(msg.createdAt), {
                                        addSuffix: true,
                                    })}
                                </small>
                            </span>
                        </div>
                    </div>
                    );
                })}
                <div ref={messagesEndRef} />
                {previewURL && <img src={previewURL} alt="preview" className='preview-image' />}
            </div>
            <div className="chat-inputs">
                <form onSubmit={submitHandler}>
                    <label htmlFor="input-file">
                        <i className="ri-attachment-line attachment"></i>
                    </label>
                    <input
                        id="input-file"
                        type="file"
                        name="file"
                        onChange={fileChangeHandler}
                    />
                    <input
                        type="text"
                        name="message"
                        value={directMessage.message}
                        onChange={changeHandler}
                        placeholder="Type a message..."
                    />
                    <button type="submit">
                        <i className="ri-send-plane-fill send"></i>
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Chat;
