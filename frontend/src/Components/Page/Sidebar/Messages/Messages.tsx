import React, { useMemo } from 'react';
import { Message as MessageModel } from 'App/State/MessagesAppState';
import { useAppStore } from 'App/useAppStore';
import Message from './Message';
import styles from './Messages.module.css';

function Messages() {
  const items = useAppStore((state) => state.messages);

  const messages = useMemo(() => {
    return items.reduce<MessageModel[]>((acc, item) => {
      acc.unshift(item);

      return acc;
    }, []);
  }, [items]);

  return (
    <div className={styles.messages}>
      {messages.map((message) => {
        return <Message key={message.id} {...message} />;
      })}
    </div>
  );
}

export default Messages;
