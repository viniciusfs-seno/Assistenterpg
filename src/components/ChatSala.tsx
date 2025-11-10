// src/components/ChatSala.tsx - VERSÃO FINAL CORRIGIDA

import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Crown, Send, Users } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  userId: string;
  userName: string;
  isDM: boolean;
  text: string;
  timestamp: string;
}

interface RoomUser {
  userId: string;
  userName: string;
  isDM: boolean;
  lastSeen: string;
}

interface ChatSalaProps {
  roomCode: string;
  currentUserId: string;
  currentUserName: string;
  isDM: boolean;
}

export function ChatSala({ 
  roomCode, 
  currentUserId, 
  currentUserName, 
  isDM 
}: ChatSalaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const storageKey = `chat_${roomCode}`;
        const savedMessages = localStorage.getItem(storageKey);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
      }
    };

    if (roomCode) {
      loadChatHistory();
    }
  }, [roomCode]);

  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = `chat_${roomCode}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, roomCode]);

  useEffect(() => {
    if (!roomCode || !currentUserId) return;

    const channel = supabase
      .channel(`room-chat:${roomCode}`, {
        config: { broadcast: { self: true } },
      })
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        console.log('💬 Mensagem recebida:', payload);
        setMessages((prev) => {
          if (prev.some(m => m.id === payload.id)) return prev;
          return [...prev, payload as Message];
        });
      })
      .on('broadcast', { event: 'user-joined' }, ({ payload }) => {
        console.log('👤 Usuário entrou:', payload);
        const newUser = payload as RoomUser;
        setUsers((prev) => {
          const filtered = prev.filter(u => u.userId !== newUser.userId);
          return [...filtered, newUser];
        });
      })
      .on('broadcast', { event: 'user-left' }, ({ payload }) => {
        console.log('👋 Usuário saiu:', payload);
        setUsers((prev) => prev.filter(u => u.userId !== payload.userId));
      })
      .on('broadcast', { event: 'user-list-request' }, () => {
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'user-joined',
            payload: {
              userId: currentUserId,
              userName: currentUserName,
              isDM,
              lastSeen: new Date().toISOString(),
            },
          });
        }
      })
      .subscribe((status) => {
        console.log('🔌 Chat status:', status);
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'user-joined',
            payload: {
              userId: currentUserId,
              userName: currentUserName,
              isDM,
              lastSeen: new Date().toISOString(),
            },
          });

          setTimeout(() => {
            channel.send({
              type: 'broadcast',
              event: 'user-list-request',
              payload: {},
            });
          }, 500);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'user-left',
          payload: { userId: currentUserId },
        });
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomCode, currentUserId, currentUserName, isDM]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !channelRef.current) return;

    const message: Message = {
      id: `${currentUserId}-${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      isDM,
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    await channelRef.current.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: message,
    });

    setInputMessage('');
  };

  return (
    <Card className="flex flex-col bg-slate-800/50 border-slate-700" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Cabeçalho - Lista de Usuários */}
      <div className="p-3 border-b border-slate-700 flex-shrink-0" style={{ maxHeight: '180px' }}>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-300">
            Usuários na Sala ({users.length})
          </span>
        </div>
        <div className="space-y-1 overflow-y-auto" style={{ maxHeight: '120px' }}>
          {users.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Aguardando usuários...</p>
          ) : (
            users
              .sort((a, b) => (b.isDM ? 1 : 0) - (a.isDM ? 1 : 0))
              .map((user) => (
                <div 
                  key={user.userId} 
                  className="flex items-center gap-2 px-2 py-1 rounded bg-slate-700/30"
                >
                  {user.isDM && <Crown className="w-3 h-3 text-yellow-500" />}
                  <span className="text-xs text-slate-300">
                    {user.userName}
                    {user.isDM && ' (Mestre)'}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Área de Mensagens com Scroll */}
      <div 
        className="flex-1 overflow-y-auto p-3 space-y-3"
        style={{ minHeight: 0, flexBasis: 0 }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-500 italic">
              Nenhuma mensagem ainda. Seja o primeiro a enviar!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.userId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex flex-col max-w-[85%]">
                <div className="flex items-center gap-1 mb-1">
                  {msg.isDM && <Crown className="w-3 h-3 text-yellow-500" />}
                  <span className="text-xs font-semibold text-slate-300">
                    {msg.userName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {/* Balão de Mensagem - LARGURA REDUZIDA */}
                <div
                className={`px-3 py-2 rounded-lg ${
                    msg.userId === currentUserId
                    ? 'bg-blue-600 text-white self-end'
                    : 'bg-slate-700 text-slate-200 self-start'
                }`}
                style={{ 
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '300px'  // ⬅️ MUDANÇA: antes era '100%'
                }}
                >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-3 border-t border-slate-700 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            maxLength={500}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {inputMessage.length}/500
        </p>
      </div>
    </Card>
  );
}
