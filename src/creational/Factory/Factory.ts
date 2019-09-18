/**
 * Factory Pattern
 * Creates objects without specifying the exact class to create.
 */

// Product interface
export interface Product {
  getName(): string;

  getPrice(): number;

  getDescription(): string;
}

// Concrete Products
export class Book implements Product {
  constructor(private title: string, private price: number, private author: string) {
  }

  getName(): string {
    return this.title;
  }

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `Book: ${this.title} by ${this.author}`;
  }
}

export class Electronics implements Product {
  constructor(private name: string, private price: number, private brand: string) {
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `Electronics: ${this.name} by ${this.brand}`;
  }
}

export class Clothing implements Product {
  constructor(private name: string, private price: number, private size: string) {
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `Clothing: ${this.name} (Size: ${this.size})`;
  }
}

export enum ProductType {
  BOOK = 'book',
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing'
}

// Factory
export class ProductFactory {
  public static createProduct(type: ProductType, ...args: any[]): Product {
    switch (type) {
      case ProductType.BOOK:
        return new Book(args[0], args[1], args[2]);
      case ProductType.ELECTRONICS:
        return new Electronics(args[0], args[1], args[2]);
      case ProductType.CLOTHING:
        return new Clothing(args[0], args[1], args[2]);
      default:
        throw new Error(`Unknown product type: ${type}`);
    }
  }
}

// Alternative Factory with registration
export class FlexibleProductFactory {
  private static creators: Map<string, (...args: any[]) => Product> = new Map();

  public static registerCreator(type: string, creator: (...args: any[]) => Product): void {
    this.creators.set(type, creator);
  }

  public static createProduct(type: string, ...args: any[]): Product {
    const creator = this.creators.get(type);
    if (!creator) {
      throw new Error(`No creator registered for type: ${type}`);
    }
    return creator(...args);
  }

  public static getRegisteredTypes(): string[] {
    return Array.from(this.creators.keys());
  }
}
