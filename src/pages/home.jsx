import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/sidebar';
import {
  getConversations,
  updateMessagesAndConversations,
} from '../features/chatSlice';
import { WhatsappHome } from '../components/Chat';
import SocketContext from '../context/SocketContext';

function Home({ socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const [onlineUsers, setOnlineUsers] = useState([]);
  //typing
  const [typing, setTyping] = useState(false);
  //join user into the socket io
  useEffect(() => {
    socket.emit('join', user._id);
    //get online users
    socket.on('get-online-users', (users) => {
      setOnlineUsers(users);
    });
  }, [user]);
  console.log('activeConversation', activeConversation);

  //get Conversations
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user]);

  //listening to received messages
  useEffect(() => {
    //lsitening to receiving a message
    socket.on('receive message', (message) => {
      dispatch(updateMessagesAndConversations(message));
    });
    //listening when a user is typing
    socket.on('typing', (conversation) => setTyping(conversation));
    socket.on('stop typing', () => setTyping(false));
  }, []);
  return (
    <div className='h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden'>
      {/*container*/}
      <div className='container h-screen flex py-[19px]'>
        {/*Sidebar*/}
        <Sidebar onlineUsers={onlineUsers} />
        {activeConversation._id ? (
          <ChatContainer onlineUsers={onlineUsers} />
        ) : (
          <WhatsappHome />
        )}
      </div>
    </div>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default HomeWithSocket;
