import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Image as ImageIcon, Smile, ChevronLeft, MoreVertical, X as XIcon } from 'lucide-react';
import { ProductInfo } from '../types';

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
}

interface ChatProps {
  onClose: () => void;
  seller: {
    id: number;
    name: string;
    avatar: string;
  };
  product: ProductInfo | null;
}

const emojis = [
  '😊', '😂', '🥰', '😍', '😒', '😘', '🤔', '😅',
  '👍', '👋', '🎉', '✨', '💖', '💕', '💯', '🔥',
  '⭐', '🌟', '💫', '💡', '💭', '💬', '🗨️', '💪',
  '🤝', '🙏', '🎵', '🎶', '🌈', '☀️', '🌙', '⚡'
];

export const Chat: React.FC<ChatProps> = ({ onClose, seller, product }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = 1;

  useEffect(() => {
    if (product) {
      setMessages([
        {
          id: 1,
          senderId: currentUserId,
          content: `你好，我对商品 "${product.name}" 很感兴趣，请问还在售吗？`,
          timestamp: new Date(),
          type: 'text'
        }
      ]);
    }
  }, [product]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        senderId: currentUserId,
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text'
      }]);
      setNewMessage('');
      setShowEmojis(false);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          senderId: seller.id,
          content: '您好，商品目前还在售，欢迎咨询具体细节。',
          timestamp: new Date(),
          type: 'text'
        }]);
      }, 1000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setMessages(prev => [...prev, {
          id: Date.now(),
          senderId: currentUserId,
          content: imageUrl,
          timestamp: new Date(),
          type: 'image'
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleImageClick = (imageUrl: string) => {
    setShowImagePreview(imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:relative md:rounded-2xl md:shadow-2xl md:max-w-2xl md:mx-auto md:my-8 md:h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{seller.name}</h3>
            <span className="text-sm text-green-500">在线</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-50">
            <MoreVertical className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="hidden md:block text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      {product && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
              <span className="text-primary-600 font-semibold">${product.price}</span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.senderId === currentUserId ? 'order-1' : 'order-2'}`}>
              <div
                className={`rounded-2xl shadow-sm ${message.type === 'image' ? 'p-1 bg-white' : 'px-4 py-2'
                  } ${message.senderId === currentUserId
                    ? 'bg-primary-600 text-white shadow-primary-100'
                    : 'bg-white border border-gray-100 text-gray-900'
                  }`}
              >
                {message.type === 'text' ? (
                  <p className="break-words">{message.content}</p>
                ) : (
                  <img
                    src={message.content}
                    alt="Shared image"
                    className="max-w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(message.content)}
                  />
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative px-4 py-3 border-t border-gray-100 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-end gap-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="发送图片"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="选择表情"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息..."
              className="w-full rounded-full border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojis && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-xl shadow-xl border border-gray-100">
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImagePreview(null)}
        >
          <button
            onClick={() => setShowImagePreview(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <XIcon className="h-6 w-6" />
          </button>
          <img
            src={showImagePreview}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};