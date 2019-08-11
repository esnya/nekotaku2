import Game from './Game';
import CharacterParameterDefinition from './CharacterParameterDefinition';

export default interface Room {
  title: string;
  gameType: string;
  characterParameterDefinitions: CharacterParameterDefinition[];
  imageId?: string;
}
