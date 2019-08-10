import Card from './Card';

export default interface CardStock {
  title: string;
  cards: Card[];
  countable: boolean;
  open: boolean;
}
