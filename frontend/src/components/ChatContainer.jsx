import React, { useEffect } from 'react'

import { useChatStore } from '../store/useChatStore'
import ChatHeader from './chatWindow/ChatHeader'
import ChatHistory from './chatWindow/ChatHistory'
import MessageInput from './chatWindow/MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'

const ChatContainer = () => {
  const {selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages, isMessagesLoading} = useChatStore()

  // Do something when chat container component starts
  // We should call useEffect() before any logic conditions
  useEffect(() => {
    // Call functions
    getMessages(selectedUser._id)
    subscribeToMessages()

    // Define a cleanup function. It will be run before the component is 
    // removed (unmounted) or before the effect re-runs (if dependencies change)
    return () => unsubscribeFromMessages()

    // Effect will only activate if the values in the list change.
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

  // Display a loading state if messages are loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );    
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <ChatHistory />
      <MessageInput />
    </div>
  )
}

export default ChatContainer