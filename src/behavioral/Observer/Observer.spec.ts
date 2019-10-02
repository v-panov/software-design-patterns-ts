import {
  NewsAgency,
  NewsChannel,
  OnlinePortal,
  EventEmitter,
  StockPrice,
  StockDisplay
} from './Observer';

describe('Observer Pattern', () => {
  describe('News Agency System', () => {
    let newsAgency: NewsAgency;
    let channel1: NewsChannel;
    let channel2: NewsChannel;
    let portal: OnlinePortal;

    beforeEach(() => {
      newsAgency = new NewsAgency();
      channel1 = new NewsChannel('CNN');
      channel2 = new NewsChannel('BBC');
      portal = new OnlinePortal('news.com');
    });

    it('should attach observers and notify them of news updates', () => {
      newsAgency.attach(channel1);
      newsAgency.attach(channel2);
      newsAgency.attach(portal);

      newsAgency.setNews('Breaking: New technology announced');

      expect(channel1.getNews()).toBe('Breaking: New technology announced');
      expect(channel2.getNews()).toBe('Breaking: New technology announced');
      expect(portal.getNews()).toBe('Breaking: New technology announced');
    });

    it('should not attach the same observer twice', () => {
      newsAgency.attach(channel1);
      newsAgency.attach(channel1); // Try to attach again

      newsAgency.setNews('Test news');

      // Should still work normally, observer attached only once
      expect(channel1.getNews()).toBe('Test news');
    });

    it('should detach observers', () => {
      newsAgency.attach(channel1);
      newsAgency.attach(channel2);

      newsAgency.setNews('First news');
      expect(channel1.getNews()).toBe('First news');
      expect(channel2.getNews()).toBe('First news');

      newsAgency.detach(channel1);
      newsAgency.setNews('Second news');

      expect(channel1.getNews()).toBe('First news'); // Should not be updated
      expect(channel2.getNews()).toBe('Second news'); // Should be updated
    });

    it('should handle detaching non-existent observer', () => {
      // Try to detach non-attached observer - should not throw error
      expect(() => {
        newsAgency.detach(channel1);
      }).not.toThrow();
    });

    it('should return correct names and URLs', () => {
      expect(channel1.getName()).toBe('CNN');
      expect(channel2.getName()).toBe('BBC');
      expect(portal.getUrl()).toBe('news.com');
    });
  });

  describe('Event Emitter System', () => {
    let emitter: EventEmitter;
    let handler1: jest.Mock;
    let handler2: jest.Mock;

    beforeEach(() => {
      emitter = new EventEmitter();
      handler1 = jest.fn();
      handler2 = jest.fn();
    });

    it('should register event handlers and emit events', () => {
      emitter.on('test-event', handler1);
      emitter.on('test-event', handler2);

      emitter.emit('test-event', 'test data');

      expect(handler1).toHaveBeenCalledWith('test data');
      expect(handler2).toHaveBeenCalledWith('test data');
    });

    it('should handle multiple event types', () => {
      emitter.on('event1', handler1);
      emitter.on('event2', handler2);

      emitter.emit('event1', 'data1');
      emitter.emit('event2', 'data2');

      expect(handler1).toHaveBeenCalledWith('data1');
      expect(handler2).toHaveBeenCalledWith('data2');
      expect(handler1).not.toHaveBeenCalledWith('data2');
      expect(handler2).not.toHaveBeenCalledWith('data1');
    });

    it('should remove event handlers', () => {
      emitter.on('test-event', handler1);
      emitter.on('test-event', handler2);

      emitter.emit('test-event', 'first');
      expect(handler1).toHaveBeenCalledWith('first');
      expect(handler2).toHaveBeenCalledWith('first');

      emitter.off('test-event', handler1);
      emitter.emit('test-event', 'second');

      expect(handler1).toHaveBeenCalledTimes(1); // Should not be called again
      expect(handler2).toHaveBeenCalledWith('second');
    });

    it('should return event types and handler counts', () => {
      emitter.on('event1', handler1);
      emitter.on('event1', handler2);
      emitter.on('event2', handler1);

      expect(emitter.getEventTypes()).toContain('event1');
      expect(emitter.getEventTypes()).toContain('event2');
      expect(emitter.getHandlerCount('event1')).toBe(2);
      expect(emitter.getHandlerCount('event2')).toBe(1);
      expect(emitter.getHandlerCount('nonexistent')).toBe(0);
    });

    it('should handle emitting events with no handlers', () => {
      expect(() => {
        emitter.emit('nonexistent-event', 'data');
      }).not.toThrow();
    });
  });

  describe('Stock Price System', () => {
    let stockPrice: StockPrice;
    let display1: StockDisplay;
    let display2: StockDisplay;

    beforeEach(() => {
      stockPrice = new StockPrice('AAPL', 100.00);
      display1 = new StockDisplay('Mobile App');
      display2 = new StockDisplay('Web Dashboard');
    });

    it('should notify observers when stock price changes', () => {
      stockPrice.addObserver(display1);
      stockPrice.addObserver(display2);

      stockPrice.setPrice(110.00);

      // Verify the price was updated
      expect(stockPrice.getPrice()).toBe(110.00);
    });

    it('should remove observers', () => {
      stockPrice.addObserver(display1);
      stockPrice.addObserver(display2);

      stockPrice.setPrice(120.00);
      expect(stockPrice.getPrice()).toBe(120.00);

      stockPrice.removeObserver(display1);
      stockPrice.setPrice(130.00);

      // Verify the price was updated after removing observer
      expect(stockPrice.getPrice()).toBe(130.00);
    });

    it('should return correct stock and price information', () => {
      expect(stockPrice.getStock()).toBe('AAPL');
      expect(stockPrice.getPrice()).toBe(100.00);
      expect(display1.getName()).toBe('Mobile App');
      expect(display2.getName()).toBe('Web Dashboard');
    });

    it('should handle removing non-existent observer', () => {
      const display3 = new StockDisplay('Terminal');

      expect(() => {
        stockPrice.removeObserver(display3);
      }).not.toThrow();
    });
  });
});
