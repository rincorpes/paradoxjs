export type EventCallback = (data: any) => void;
export type EventMap = { [key: string]: Set<EventCallback> };
/**
 * PubSub class for implementing publish-subscribe pattern.
 */
class PubSub {
  events: EventMap;

  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event.
   * @param {string} event - The event name to subscribe to.
   * @param {function} callback - The callback function to be executed when the event is published.
   * @returns {number} - The number of callbacks subscribed to the event.
   */
  subscribe(event: string, callback: EventCallback): Set<EventCallback> {
    let self = this;
    if (!self.events.hasOwnProperty(event)) {
      self.events[event] = new Set();
    }

    return self.events[event].add(callback);
  }

  /**
   * Unsubscribe from an event.
   * @param {string} event - The event name to unsubscribe from.
   * @param {function} callback - The callback function to be removed from the subscribers.
   * @returns {array} - An array of callbacks that remain subscribed to the event.
   */
  unsubscribe(event: string, callback: EventCallback): Set<EventCallback> {
    let self = this;    
    if (self.events.hasOwnProperty(event)) {
      self.events[event].delete(callback);
    } else {
      console.warn(`Event ${event} does not exist`);
    }
    return self.events[event];
  }

  /**
   * Publish an event.
   * @param {string} event - The event name to publish.
   * @param {*} [data={}] - The data to be passed to the event subscribers.
   * @returns {array} - An array of return values from the event subscribers.
   */
  publish(event: string, data: any = {}): Array<any> {
    let self = this;
    let results: (void | null)[][] = [];
    if (self.events.hasOwnProperty(event)) {
      let eventResults = [...self.events[event]].map((callback) => {
        try {
          return callback(data);
        } catch (e) {
          console.warn(e);
          return null;
        }
      });
      eventResults.forEach((result: any) => results.push(result));
    }

    if (self.events.hasOwnProperty("*")) {
      let eventResults = [...self.events["*"]].map((callback) => {
        try {
          return callback(data);
        } catch (e) {
          console.warn(e);
          return null;
        }
      });
        eventResults.forEach((result: any) => results.push(result));
    }

    return results;
  }
}

const pubsub = new PubSub();

export default pubsub
