# Software Design Patterns in TypeScript

Implementation of common software design patterns using TypeScript. This project demonstrates the
practical implementation of design patterns from the Gang of Four (GoF) catalog.

## Patterns Implemented

The patterns are organized into three categories based on their purpose:

- **Creational patterns** provide object creation mechanisms that increase flexibility and reuse of
  existing code.
- **Structural patterns** explain how to assemble objects and classes into larger structures while
  keeping these structures flexible and efficient.
- **Behavioral patterns** take care of effective communication and the assignment of
  responsibilities between objects.

### Behavioral Patterns

- **Chain of Responsibility** - Avoids coupling the sender of a request to its receiver by giving
  more than one object a chance to handle the request. Chains the receiving objects and passes the
  request along the chain until an object handles it
- **Command** - Encapsulates a request as an object, allowing you to parameterize clients with
  different requests, queue or log requests, and support undoable operations
- **Interpreter** - Given a language, defines a representation for its grammar along with an
  interpreter that uses the representation to interpret sentences in the language
- **Iterator** - Provides a way to access the elements of an aggregate object sequentially without
  exposing its underlying representation
- **Mediator** - Defines an object that encapsulates how a set of objects interact, promoting loose
  coupling by keeping objects from referring to each other explicitly
- **Memento** - Without violating encapsulation, captures and externalizes an object's internal
  state so that the object can be restored to this state later
- **Observer** - Defines a one-to-many dependency between objects so that when one object changes
  state, all its dependents are notified and updated automatically
- **State** - Allows an object to alter its behavior when its internal state changes. The object
  will appear to change its class
- **Strategy** - Defines a family of algorithms, encapsulates each one, and makes them
  interchangeable. Strategy lets the algorithm vary independently of clients that use it
- **Template Method** - Defines the skeleton of an algorithm in a method, deferring some steps to
  subclasses. Template Method lets subclasses redefine certain steps of an algorithm without
  changing the algorithm's structure
- **Visitor** - Represents an operation to be performed on the elements of an object structure.
  Visitor lets you define a new operation without changing the classes of the elements on which it
  operates

### Creational Patterns

- **Abstract Factory** - Provides an interface for creating families of related or dependent objects
- **Builder** - Separates object construction from its representation
- **Factory** - Creates objects without specifying the exact class to create
- **Factory Method** - Defines an interface for creating an object, but lets subclasses decide which
  class to instantiate
- **Prototype** - Creates new objects by cloning existing ones, avoiding the overhead of creating
  objects from scratch
- **Singleton** - Ensures a class has only one instance and provides a global point of access to it

### Structural Patterns

- **Adapter** - Converts the interface of a class into another interface clients expect, allowing
  classes to work together that couldn't otherwise
- **Bridge** - Decouples an abstraction from its implementation so that the two can vary
  independently
- **Composite** - Composes objects into tree structures to represent part-whole hierarchies, letting
  clients treat individual objects and compositions uniformly
- **Decorator** - Attaches additional responsibilities to objects dynamically without altering their
  structure
- **Facade** - Provides a simplified interface to a complex subsystem, making it easier to use
- **Flyweight** - Uses sharing to support large numbers of similar objects efficiently by minimizing
  memory usage
- **Proxy** - Provides a surrogate or placeholder for another object to control access to it

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/) (v10 or higher recommended)
- [npm](https://docs.npmjs.com/) (v6 or higher recommended)

### Installation

```bash
# Install dependencies
npm install
```

### Build

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Technology Stack

- [TypeScript](https://www.typescriptlang.org) - Strongly typed programming language
- [Jest](https://jestjs.io) - Testing framework
- [ts-jest](https://kulshekhar.github.io/ts-jest/) - TypeScript preprocessor for Jest
