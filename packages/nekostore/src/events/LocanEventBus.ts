import { EventEmitter } from 'events';
import Unsubscribe from '../core/Unsubscribe';
import EventBus from '../core/EventBus';

export default class LocalEventBus implements EventBus {
  private readonly emitter = new EventEmitter();

  public on<T>(event: string, callback: (value: T) => void): Unsubscribe {
    this.emitter.on(event, callback);

    return () => {
      this.emitter.off(event, callback);
    };
  }

  public emit<T>(event: string, value: T): void {
    this.emitter.emit(event, value);
  }
}
