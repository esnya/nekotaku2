import DiceResult from './DiceResult';
import Game from './Game';
import ChatName from './ChatName';

interface MessageNodeBase<T extends string> {
  type: T;
  text: string;
}

export type MessageTextNode = MessageNodeBase<'text'>;

export interface MessageDiceResultNode extends MessageNodeBase<'dice_result'> {
  game: Game;
  results: DiceResult[];
}

export type MessageNode = MessageTextNode;

export default interface Message {
  chatName: ChatName;
  body: MessageNode[];
  to?: string[];
}
