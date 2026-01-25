import React, { use, useEffect, useState } from 'react'
import { MdSend } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'
import useMessageStore from '../store/messageStore.js'
import useRoomStore from '../store/roomStore.js'
import { socket } from '../socket/socket.js'

const MessageContainer = ({ setIsOpenMessage }) => {
    const [text, setText] = useState('')
    const messages = useMessageStore((state) => state.messages);
    const sendMessage = useMessageStore((state) => state.sendMessage);
    const addMessage = useMessageStore((state) => state.addMessage);

    const { getUserId, getRoomId, getPeer } = useRoomStore()

    useEffect(() => {
        const onNewMessage = (payload) => {
            // payload = { roomId, senderId, message }
            console.log("New message received:", payload);
            // Optional: filter by room
            if (payload.roomId !== getRoomId()) return;

            addMessage({
                id: payload.senderId,
                content: payload.message,
                sender: 'peer',
                timestamp: new Date().toISOString()
            });
        };

        socket.on("new_message", onNewMessage);
        return () => socket.off("new_message", onNewMessage);
    }, [getRoomId, addMessage]);


    const onSendMessage = async () => {
        const message = text.trim();
        if (!message) return;

        const userMessage = {
            id: getUserId(),
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        }

        setText('');

        try {
            const response = await sendMessage({ message: message, roomId: getRoomId(), senderId: getPeer() });
            addMessage(userMessage);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }

    return (
        <div className='messaging w-[25%] border h-full rounded-2xl flex flex-col'>
            <div className='headerPartMessage h-[8%] flex m-2 justify-between items-center px-4 bg-gray-100 rounded-2xl'>
                <div>Messages</div>
                <div onClick={() => setIsOpenMessage((v) => !v)} className='cursor-pointer p-3 rounded-full hover:bg-gray-200'>
                    <RxCross1 />
                </div>
            </div>
            <div className='contentPartmessage grow p-4 overflow-y-auto'>
                {
                    messages.map((mes, index) => (
                        <div key={index} className={`message mb-4 ${mes.sender === 'user' ? 'flex justify-end' : ''}`}>
                            <div className={`${mes.sender === 'user' ? 'bg-gray-200' : 'bg-blue-500 text-white'} px-4 py-2 rounded-2xl max-w-[70%]`}>
                                {mes.content}
                            </div>
                        </div>
                    ))
                }
                <div className='message mb-4'>
                    <div className='bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-[70%]'>
                        Hello! How are you?
                    </div>
                </div>
                <div className='message mb-4 flex justify-end'>
                    <div className='bg-gray-200 px-4 py-2 rounded-2xl max-w-[70%]'>
                        I'm good, thank you! How about you?
                    </div>
                </div>
                <div className='message mb-4'>
                    <div className='bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-[70%]'>
                        I'm doing well, thanks for asking!
                    </div>
                </div>
            </div>
            <div className='footerPartMessage h-[8%] flex items-center px-2 rounded-2xl m-2 gap-2'>
                <input type="text" placeholder='Type a message...' className='grow border rounded px-2 py-2' value={text} onChange={(e) => setText(e.target.value)} />
                <button onClick={onSendMessage} className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'>
                    <MdSend className='text-2xl' />
                </button>
            </div>
        </div>
    )
}

export default MessageContainer