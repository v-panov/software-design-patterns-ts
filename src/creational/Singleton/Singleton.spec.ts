import {Singleton} from './Singleton';

describe('Singleton Pattern', () => {
  it('should return the same instance when getInstance is called multiple times', () => {
    const instance1 = Singleton.getInstance();
    const instance2 = Singleton.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should maintain state across different getInstance calls', () => {
    const instance1 = Singleton.getInstance();
    instance1.setValue(42);

    const instance2 = Singleton.getInstance();

    expect(instance2.getValue()).toBe(42);
  });

  it('should execute business logic correctly', () => {
    const instance = Singleton.getInstance();
    instance.setValue(100);

    const result = instance.someBusinessLogic();

    expect(result).toBe('Singleton instance with value: 100');
  });
});
