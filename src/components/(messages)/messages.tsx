"use client"

import { useState, useEffect, useRef } from 'react';
import { pusherClient } from '../../lib/pusher';
import styles from './messages.module.css';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

interface MessagesProps {
  SenderUserId: { Id: string | number };
  ReceiverUserId: { Id: string | number };
}

export default function Messages({ SenderUserId, ReceiverUserId }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  useEffect(() => {
    const channelName = `chat-${[SenderUserId.Id, ReceiverUserId.Id].sort().join('-')}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind('new-message', (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    });

    fetchMessages();

    return () => {
      channel.unbind('new-message');
      pusherClient.unsubscribe(channelName);
    };
  }, [SenderUserId.Id, ReceiverUserId.Id]);

  // Add new useEffect for handling scrolling when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages for:', {
        sender: SenderUserId.Id,
        receiver: ReceiverUserId.Id
      });

      // Update the fetch URL to match your API route
      const response = await fetch(
        `/api/getMessages?senderId=${SenderUserId.Id}&receiverId=${ReceiverUserId.Id}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch messages');
      }

      const data = await response.json();
      console.log('Received messages:', data);
      setMessages(data);
      // Remove scrollToBottom from here since it will be triggered by the useEffect
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch messages'));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Update the fetch URL to match your API route
      const response = await fetch('/api/getMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: SenderUserId.Id,
          receiverId: ReceiverUserId.Id,
          content: messageText.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error : new Error('Failed to send message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messagesList}>
        {error && (
          <div className={styles.errorMessage}>
            {error.message}
          </div>
        )}
        
        {messages.map((message) => {
          const isSender = message.senderId === Number(SenderUserId.Id);
          const messageTime = new Date(message.createdAt);
          const formattedTime = messageTime.toLocaleTimeString('cs-CZ', {
            hour: '2-digit',
            minute: '2-digit',
          });
          
          return (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${
                isSender ? styles.senderMessage : styles.receiverMessage
              }`}
            >
              <div className={styles.messageBubble}>
                <p className={styles.messageContent}>{message.content}</p>
                
              </div>
              <span className={styles.messageTime}>
                  {formattedTime}
                </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} style={{ height: "0px" }} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className={styles.messageInput}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !messageText.trim()}
            className={styles.sendButton}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}