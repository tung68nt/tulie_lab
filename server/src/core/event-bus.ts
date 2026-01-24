import { EventEmitter } from 'events';

export type EventType =
    | 'ORDER_CREATED'
    | 'ORDER_PAID'
    | 'ORDER_FAILED'
    | 'USER_REGISTERED'
    | 'SECURITY_ALERT';

export interface BaseEvent {
    type: EventType;
    payload: any;
    timestamp: Date;
}

export class EventBus extends EventEmitter {
    private static instance: EventBus;

    private constructor() {
        super();
        this.setMaxListeners(20); // allow slightly more listeners than default
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    public publish(event: BaseEvent): void {
        console.log(`[EventBus] Publishing event: ${event.type}`);
        this.emit(event.type, event.payload);
    }

    public subscribe(type: EventType, handler: (payload: any) => Promise<void> | void): void {
        console.log(`[EventBus] Subscribing to: ${type}`);
        this.on(type, async (payload) => {
            try {
                await handler(payload);
            } catch (error) {
                console.error(`[EventBus] Error handling event ${type}:`, error);
            }
        });
    }
}
