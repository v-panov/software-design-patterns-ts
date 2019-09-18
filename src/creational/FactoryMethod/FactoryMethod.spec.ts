import {
  Creator,
  ConcreteCreatorA,
  ConcreteCreatorB,
} from './FactoryMethod';

describe('Factory Method Pattern', () => {
  function clientCode(creator: Creator) {
    // The client code works with an instance of a concrete creator
    // but through its base interface
    return creator.someOperation();
  }

  it('should work with ConcreteCreatorA', () => {
    const result = clientCode(new ConcreteCreatorA());
    expect(result).toContain('Result of ConcreteProductA');
  });

  it('should work with ConcreteCreatorB', () => {
    const result = clientCode(new ConcreteCreatorB());
    expect(result).toContain('Result of ConcreteProductB');
  });
});
