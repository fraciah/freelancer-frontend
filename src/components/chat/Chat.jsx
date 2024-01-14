import React from 'react';
import './chat.css';
import { IoSend } from "react-icons/io5";
import { useEffect } from 'react';
import { useChatContext } from '../../providers/ChatProvider';
import { useAuthContext } from '../../providers/AuthProvider';
import { timeFormater } from '../../../utils/helpers/TimeFormater';
import { IoChatbubblesSharp } from "react-icons/io5";
import { useRef } from 'react';
import { useState } from 'react';
import { useLayoutEffect } from 'react';

const Chat = ({orderId, client, freelancer}) => {

    const { loadedUserProfile } = useAuthContext();
    const { loadingChats, chats, getChats, sendChat, socket, typingData } = useChatContext();

    const [typing, setTyping] = useState(false);

    const messageRef = useRef();     
    const [msg, setMsg] = useState();

    const chatBoxRef = useRef();

    const getReceiver = () => {
        return client.user.username
        // if  (loadedUserProfile.username === client.user.username) {
        //     return freelancer.user.username
        // } else if (loadedUserProfile.username === freelancer.user.username) {
        //     return client.user.username
        // }
    }

    const checkMsg = () =>{
        setMsg(messageRef.current.value);

        const data = JSON.stringify({
            'message':'typing',
            'orderId': orderId,
            'receiver': getReceiver()
        });
        if (socket.OPEN){
            socket.send(data);
        }
    }

    useLayoutEffect(()=>{
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight*2;
        } 
    }, [chats])

    const submitMessage = (e) => {
        e.preventDefault();
        sendChat(msg, orderId, getReceiver())
        .then(()=>{
            setMsg('');                                   
        })

        if (msg)  {
            sendChat(msg, orderId)
            .then(()=>{
                setMsg('');                                   
            }) 
        }
    }   
    
    useEffect(()=>{
        if (typingData?.order_id === orderId) {
            setTyping(typingData.typing);               
        } else {
            setTyping(false);
        }
        
    }, [typingData, orderId]);


    useEffect(()=>{
        orderId && getChats(orderId)
    }, [orderId, loadedUserProfile])

    return (
        <div className='chat'>
            <div className="chat-header">
                <div className="receiver-profile">
                    <article  className='img-chat' >{`${(getReceiver()?.charAt(0)?.toUpperCase() + getReceiver()?.slice(1).slice(0,1))}`}</article>
                    <div style={{
                        display:'flex',
                        flexDirection:'column',
                    }}>
                        <article>
                            {getReceiver()}                    
                        </article>
                    {
                        
                        typing && <span>Typing...</span>
                        
                    }
                    </div>                          
                </div>                                               
            </div>
            {
                (chats?.length > 0)?
                <div className="messages-box" id='msg' ref={chatBoxRef}>
                    {
                        chats?.map((msg, index)=>{
                            return (
                                <>
                                    <div key={index} className= {                            
                                            msg.sender?.username === loadedUserProfile?.username ? 'send-message': "received-message"}
                                        >
                                        <article>
                                            {msg.message}                           
                                        </article>
                                        <div className='time'>
                                            <small className='sent-at'>
                                                {timeFormater(msg.timestamp)}
                                            </small>
                                        </div>
                                    </div>                                
                                </>
                            )
                        })
                    }                                               
                </div>:
                <div className='empty-inbox'>
                    <IoChatbubblesSharp className='chat-icon' size={50}/>
                    <article>Start chat</article>
                </div>
            }            
            <form className='message-reply-box' onSubmit={submitMessage}>
                <input required type="text" value={msg} ref={messageRef} onChange={checkMsg} placeholder='Type your message' />                
                <IoSend title={!msg && 'Type a message'} size={25} type='submit' className={ msg?'submit-message active':'submit-message inactive' }/>
            </form>
        </div>
    );
}

export default Chat;