/**
 * Factory Method Pattern
 * Defines an interface for creating an object but lets subclasses decide
 * which class to instantiate. Factory Method lets a class defer instantiation to subclasses.
 */

// Product interface
export interface Product {
  operation(): string;
}

// Concrete Products
export class ConcreteProductA implements Product {
  operation(): string {
    return 'Result of ConcreteProductA';
  }
}

export class ConcreteProductB implements Product {
  operation(): string {
    return 'Result of ConcreteProductB';
  }
}

// Creator - abstract class with factory method
export abstract class Creator {
  /**
   * The factory method that subclasses must implement
   */
  abstract factoryMethod(): Product;

  /**
   * The template method that uses the factory method
   */
  someOperation(): string {
    // Call the factory method to create a Product object
    const product = this.factoryMethod();
    // Now use the product
    return `Creator: The same creator's code has just worked with ${product.operation()}`;
  }
}

// Concrete Creators
export class ConcreteCreatorA extends Creator {
  factoryMethod(): Product {
    return new ConcreteProductA();
  }
}

export class ConcreteCreatorB extends Creator {
  factoryMethod(): Product {
    return new ConcreteProductB();
  }
}
