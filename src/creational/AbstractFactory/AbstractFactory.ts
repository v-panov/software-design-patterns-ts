/**
 * Abstract Factory Pattern
 * Provides an interface for creating families of related or dependent objects
 * without specifying their concrete classes.
 */

// Abstract Products
export interface Button {
  render(): string;

  onClick(): string;
}

export interface Checkbox {
  render(): string;

  toggle(): string;
}

// Concrete Products for Windows
export class WindowsButton implements Button {
  render(): string {
    return 'Rendering a button in Windows style';
  }

  onClick(): string {
    return 'Windows button clicked';
  }
}

export class WindowsCheckbox implements Checkbox {
  render(): string {
    return 'Rendering a checkbox in Windows style';
  }

  toggle(): string {
    return 'Windows checkbox toggled';
  }
}

// Concrete Products for MacOS
export class MacOSButton implements Button {
  render(): string {
    return 'Rendering a button in MacOS style';
  }

  onClick(): string {
    return 'MacOS button clicked';
  }
}

export class MacOSCheckbox implements Checkbox {
  render(): string {
    return 'Rendering a checkbox in MacOS style';
  }

  toggle(): string {
    return 'MacOS checkbox toggled';
  }
}

// Abstract Factory Interface
export interface GUIFactory {
  createButton(): Button;

  createCheckbox(): Checkbox;
}

// Concrete Factories
export class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }

  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

export class MacOSFactory implements GUIFactory {
  createButton(): Button {
    return new MacOSButton();
  }

  createCheckbox(): Checkbox {
    return new MacOSCheckbox();
  }
}

// Client class that works with factories and products
export class Application {
  private button: Button;
  private checkbox: Checkbox;

  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }

  createUI(): string {
    return `${this.button.render()}\n${this.checkbox.render()}`;
  }

  executeUI(): string {
    return `${this.button.onClick()}\n${this.checkbox.toggle()}`;
  }
}
