import Unsubscribe from './Unsubscribe';

export default interface EventBus {
  emit<T>(event: string, value: T): void;
  on<T>(event: string, callback: (value: T) => void): Unsubscribe;
}
