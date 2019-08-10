import ChatName from './ChatName';
import DrawingStyle from './DrawingStyle';
import User from './User';

export default interface RoomMember {
  chatName: ChatName;
  drawingStyle: DrawingStyle;
  user: User;
}
