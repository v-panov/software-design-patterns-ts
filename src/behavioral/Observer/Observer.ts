/**
 * Observer Pattern
 * Defines a one-to-many dependency between objects so that when one object changes state,
 * all its dependents are notified and updated automatically.
 */

// Observer interface
export interface Observer {
  update(subject: Subject): void;
}

// Subject interface
export interface Subject {
  attach(observer: Observer): void;

  detach(observer: Observer): void;

  notify(): void;
}

// Concrete Subject
export class NewsAgency implements Subject {
  private observers: Observer[] = [];
  private news: string = '';

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return;
    }
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return;
    }
    this.observers.splice(observerIndex, 1);
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  public setNews(news: string): void {
    this.news = news;
    this.notify();
  }

  public getNews(): string {
    return this.news;
  }
}

// Concrete Observers
export class NewsChannel implements Observer {
  private name: string;
  private news: string = '';

  constructor(name: string) {
    this.name = name;
  }

  public update(subject: Subject): void {
    if (subject instanceof NewsAgency) {
      this.news = subject.getNews();
    }
  }

  public getName(): string {
    return this.name;
  }

  public getNews(): string {
    return this.news;
  }
}

export class OnlinePortal implements Observer {
  private url: string;
  private news: string = '';

  constructor(url: string) {
    this.url = url;
  }

  public update(subject: Subject): void {
    if (subject instanceof NewsAgency) {
      this.news = subject.getNews();
    }
  }

  public getUrl(): string {
    return this.url;
  }

  public getNews(): string {
    return this.news;
  }
}

// Alternative implementation with Event System
export type EventType = string;
export type EventHandler<T = any> = (data: T) => void;

export class EventEmitter {
  private events: Map<EventType, EventHandler[]> = new Map();

  public on<T>(event: EventType, handler: EventHandler<T>): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(handler);
  }

  public off<T>(event: EventType, handler: EventHandler<T>): void {
    const handlers = this.events.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  public emit<T>(event: EventType, data?: T): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  public getEventTypes(): EventType[] {
    return Array.from(this.events.keys());
  }

  public getHandlerCount(event: EventType): number {
    const handlers = this.events.get(event);
    return handlers && handlers.length || 0;
  }
}

// Stock Price example
export interface StockObserver {
  update(stock: string, price: number): void;
}

export class StockPrice {
  private observers: StockObserver[] = [];
  private stock: string;
  private price: number;

  constructor(stock: string, price: number) {
    this.stock = stock;
    this.price = price;
  }

  public addObserver(observer: StockObserver): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: StockObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public setPrice(price: number): void {
    this.price = price;
    this.notifyObservers();
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => observer.update(this.stock, this.price));
  }

  public getStock(): string {
    return this.stock;
  }

  public getPrice(): number {
    return this.price;
  }
}

export class StockDisplay implements StockObserver {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public update(stock: string, price: number): void {
    // Observer updated with new stock price
  }

  public getName(): string {
    return this.name;
  }
}
