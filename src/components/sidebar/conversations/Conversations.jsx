import { useSelector } from 'react-redux';
import { checkOnlineStatus, getConversationId } from '../../../utils/chat';
import Conversation from './Conversation';

export default function Conversations({ onlineUsers, typing }) {
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat,
  );

  const { user } = useSelector((state) => state.user);

    console.log(
      'conversations array:',
      conversations.map((c) => ({
        id: c._id,
        name: c.name,
        latest: c.latestMessage?.message,
      })),
    );
    console.log('activeConversation:', activeConversation._id);

  const uniqueConversations = conversations.filter(
    (convo, index, self) =>
      index === self.findIndex((c) => c._id === convo._id),
  );

  return (
    <div className='convos scrollbar'>
      <ul>
        {uniqueConversations
          .filter(
            (c) =>
              c.latestMessage ||
              c._id === activeConversation._id ||
              c.isGroup == true,
          )
          .map((convo) => {
            let check = checkOnlineStatus(onlineUsers, user, convo.users);
            return (
              <Conversation
                convo={convo}
                key={convo._id}
                online={!convo.isGroup && check ? true : false}
                typing={typing}
              />
            );
          })}
      </ul>
    </div>
  );
}
