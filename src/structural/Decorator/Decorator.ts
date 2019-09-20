/**
 * Decorator Pattern
 * Allows behavior to be added to objects dynamically without altering their structure.
 */

// Component interface
export interface Coffee {
  getDescription(): string;

  getCost(): number;
}

// Concrete Component
export class SimpleCoffee implements Coffee {
  getDescription(): string {
    return 'Simple coffee';
  }

  getCost(): number {
    return 2.0;
  }
}

// Base Decorator
export abstract class CoffeeDecorator implements Coffee {
  protected coffee: Coffee;

  constructor(coffee: Coffee) {
    this.coffee = coffee;
  }

  getDescription(): string {
    return this.coffee.getDescription();
  }

  getCost(): number {
    return this.coffee.getCost();
  }
}

// Concrete Decorators
export class MilkDecorator extends CoffeeDecorator {
  constructor(coffee: Coffee) {
    super(coffee);
  }

  getDescription(): string {
    return this.coffee.getDescription() + ', milk';
  }

  getCost(): number {
    return this.coffee.getCost() + 0.5;
  }
}

export class SugarDecorator extends CoffeeDecorator {
  constructor(coffee: Coffee) {
    super(coffee);
  }

  getDescription(): string {
    return this.coffee.getDescription() + ', sugar';
  }

  getCost(): number {
    return this.coffee.getCost() + 0.2;
  }
}

export class WhipDecorator extends CoffeeDecorator {
  constructor(coffee: Coffee) {
    super(coffee);
  }

  getDescription(): string {
    return this.coffee.getDescription() + ', whip';
  }

  getCost(): number {
    return this.coffee.getCost() + 0.7;
  }
}

export class VanillaDecorator extends CoffeeDecorator {
  constructor(coffee: Coffee) {
    super(coffee);
  }

  getDescription(): string {
    return this.coffee.getDescription() + ', vanilla';
  }

  getCost(): number {
    return this.coffee.getCost() + 0.6;
  }
}

export class CaramelDecorator extends CoffeeDecorator {
  constructor(coffee: Coffee) {
    super(coffee);
  }

  getDescription(): string {
    return this.coffee.getDescription() + ', caramel';
  }

  getCost(): number {
    return this.coffee.getCost() + 0.8;
  }
}

// Alternative implementation with Text Formatting
export interface TextFormatter {
  format(text: string): string;
}

export class PlainTextFormatter implements TextFormatter {
  format(text: string): string {
    return text;
  }
}

export abstract class TextFormatterDecorator implements TextFormatter {
  protected formatter: TextFormatter;

  constructor(formatter: TextFormatter) {
    this.formatter = formatter;
  }

  format(text: string): string {
    return this.formatter.format(text);
  }
}

export class BoldDecorator extends TextFormatterDecorator {
  format(text: string): string {
    return `<b>${this.formatter.format(text)}</b>`;
  }
}

export class ItalicDecorator extends TextFormatterDecorator {
  format(text: string): string {
    return `<i>${this.formatter.format(text)}</i>`;
  }
}

export class UnderlineDecorator extends TextFormatterDecorator {
  format(text: string): string {
    return `<u>${this.formatter.format(text)}</u>`;
  }
}

export class ColorDecorator extends TextFormatterDecorator {
  private color: string;

  constructor(formatter: TextFormatter, color: string) {
    super(formatter);
    this.color = color;
  }

  format(text: string): string {
    return `<span style="color: ${this.color}">${this.formatter.format(text)}</span>`;
  }
}
