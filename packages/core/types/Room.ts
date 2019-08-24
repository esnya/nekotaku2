import CharacterParameterDefinition from './CharacterParameterDefinition';

export default interface Room {
  title: string;
  gameType: string;
  characterParameterDefinitions: CharacterParameterDefinition[];
  description?: string;
  imageId?: string;
}
