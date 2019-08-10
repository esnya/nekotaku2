import Game from './Game';
import CharacterParameterDefinition from './CharacterParameterDefinition';

export default interface Room {
  title: string;
  game: Game;
  characterParameterDefinitions: CharacterParameterDefinition[];
}
