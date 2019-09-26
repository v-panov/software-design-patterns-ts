# Software Design Patterns in TypeScript

Implementation of common software design patterns using TypeScript.

## Patterns Implemented

### Creational Patterns

- **Singleton** - Ensures a class has only one instance and provides a global point of access to it
- **Factory Method** - Defines an interface for creating an object, but lets subclasses decide which class to instantiate
- **Abstract Factory** - Provides an interface for creating families of related or dependent objects
- **Factory** - Creates objects without specifying the exact class to create
- **Builder** - Separates object construction from its representation
- **Prototype** - Creates new objects by cloning existing ones, avoiding the overhead of creating objects from scratch

### Structural Patterns

- **Adapter** - Converts the interface of a class into another interface clients expect, allowing classes to work together that couldn't otherwise
- **Bridge** - Decouples an abstraction from its implementation so that the two can vary independently
- **Composite** - Composes objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly
- **Decorator** - Attaches additional responsibilities to objects dynamically without altering their structure
- **Facade** - Provides a simplified interface to a complex subsystem, making it easier to use
- **Flyweight** - Uses sharing to support large numbers of similar objects efficiently by minimizing memory usage
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
