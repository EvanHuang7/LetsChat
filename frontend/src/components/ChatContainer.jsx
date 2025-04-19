import React, { useEffect } from 'react'

import { useChatStore } from '../store/useChatStore'
import ChatWindowHeader from './chatWindow/ChatWindowHeader'
import MessageInput from './chatWindow/MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'

const ChatContainer = () => {
  const {selectedUser, messages, getMessages, isMessagesLoading} = useChatStore()

  // Do something when chat container component starts
  // We should call useEffect() before any logic conditions
  useEffect(() => {
    // Call getMessages() function
    getMessages(selectedUser._id)
    // Effect will only activate if the values in the list change.
  }, [selectedUser._id, getMessages])

  // Display a loading state if messages are loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatWindowHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );    
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatWindowHeader />


      <div>messages...</div>


      <MessageInput />
    </div>
  )
}

export default ChatContainer