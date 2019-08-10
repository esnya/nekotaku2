export default interface Character {
  name: string;
  avatarId?: string;
  iconId?: string;
  parameters: Map<string, string>;
}
