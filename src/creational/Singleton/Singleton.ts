/**
 * Singleton Pattern
 * Ensures a class has only one instance and provides a global point of access to it.
 */

export class Singleton {
  private static instance: Singleton;
  private value: number;

  private constructor() {
    this.value = Math.random();
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public getValue(): number {
    return this.value;
  }

  public setValue(value: number): void {
    this.value = value;
  }

  public someBusinessLogic(): string {
    return `Singleton instance with value: ${this.value}`;
  }
}
