import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/sidebar';
import { getConversations } from '../features/chatSlice';
import { WhatsappHome } from '../components/Chat';
import SocketContext from '../context/SocketContext';
function Home({ socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  console.log('activeConversation', activeConversation);

  //get Conversations
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user]);
  return (
    <div className='h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden'>
      {/*container*/}
      <div className='container h-screen flex py-[19px]'>
        {/*Sidebar*/}
        <Sidebar />
        {activeConversation._id ? <ChatContainer /> : <WhatsappHome />}
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