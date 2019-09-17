/**
 * Builder Pattern
 * Constructs complex objects step by step.
 */

// Product class
export class Computer {
  private cpu?: string;
  private ram?: string;
  private storage?: string;
  private gpu?: string;
  private motherboard?: string;
  private powerSupply?: string;

  public setCpu(cpu: string): void {
    this.cpu = cpu;
  }

  public setRam(ram: string): void {
    this.ram = ram;
  }

  public setStorage(storage: string): void {
    this.storage = storage;
  }

  public setGpu(gpu: string): void {
    this.gpu = gpu;
  }

  public setMotherboard(motherboard: string): void {
    this.motherboard = motherboard;
  }

  public setPowerSupply(powerSupply: string): void {
    this.powerSupply = powerSupply;
  }

  public getSpecifications(): string {
    return `Computer Specifications:
            CPU: ${this.cpu || 'Not specified'}
            RAM: ${this.ram || 'Not specified'}
            Storage: ${this.storage || 'Not specified'}
            GPU: ${this.gpu || 'Not specified'}
            Motherboard: ${this.motherboard || 'Not specified'}
            Power Supply: ${this.powerSupply || 'Not specified'}`;
  }

  public isComplete(): boolean {
    return !!(this.cpu && this.ram && this.storage && this.motherboard && this.powerSupply);
  }
}

// Builder interface
export interface ComputerBuilder {
  setCpu(cpu: string): ComputerBuilder;

  setRam(ram: string): ComputerBuilder;

  setStorage(storage: string): ComputerBuilder;

  setGpu(gpu: string): ComputerBuilder;

  setMotherboard(motherboard: string): ComputerBuilder;

  setPowerSupply(powerSupply: string): ComputerBuilder;

  build(): Computer;
}

// Concrete Builder
export class ConcreteComputerBuilder implements ComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  public setCpu(cpu: string): ComputerBuilder {
    this.computer.setCpu(cpu);
    return this;
  }

  public setRam(ram: string): ComputerBuilder {
    this.computer.setRam(ram);
    return this;
  }

  public setStorage(storage: string): ComputerBuilder {
    this.computer.setStorage(storage);
    return this;
  }

  public setGpu(gpu: string): ComputerBuilder {
    this.computer.setGpu(gpu);
    return this;
  }

  public setMotherboard(motherboard: string): ComputerBuilder {
    this.computer.setMotherboard(motherboard);
    return this;
  }

  public setPowerSupply(powerSupply: string): ComputerBuilder {
    this.computer.setPowerSupply(powerSupply);
    return this;
  }

  public build(): Computer {
    const result = this.computer;
    this.computer = new Computer(); // Reset for next build
    return result;
  }
}

// Director class
export class ComputerDirector {
  private builder: ComputerBuilder;

  constructor(builder: ComputerBuilder) {
    this.builder = builder;
  }

  public buildGamingComputer(): Computer {
    return this.builder
      .setCpu('Intel i7')
      .setRam('32GB')
      .setStorage('1TB')
      .setGpu('NVIDIA')
      .setMotherboard('ASUS')
      .setPowerSupply('750W 80+ Gold')
      .build();
  }

  public buildOfficeComputer(): Computer {
    return this.builder
      .setCpu('Intel i5')
      .setRam('16GB')
      .setStorage('512GB')
      .setMotherboard('MSI')
      .setPowerSupply('500W 80+ Bronze')
      .build();
  }

  public buildBudgetComputer(): Computer {
    return this.builder
      .setCpu('AMD Ryzen 3')
      .setRam('8GB')
      .setStorage('256GB')
      .setMotherboard('ASRock')
      .setPowerSupply('400W')
      .build();
  }
}

// Fluent Builder (alternative approach)
export class FluentComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  public static create(): FluentComputerBuilder {
    return new FluentComputerBuilder();
  }

  public withCpu(cpu: string): FluentComputerBuilder {
    this.computer.setCpu(cpu);
    return this;
  }

  public withRam(ram: string): FluentComputerBuilder {
    this.computer.setRam(ram);
    return this;
  }

  public withStorage(storage: string): FluentComputerBuilder {
    this.computer.setStorage(storage);
    return this;
  }

  public withGpu(gpu: string): FluentComputerBuilder {
    this.computer.setGpu(gpu);
    return this;
  }

  public withMotherboard(motherboard: string): FluentComputerBuilder {
    this.computer.setMotherboard(motherboard);
    return this;
  }

  public withPowerSupply(powerSupply: string): FluentComputerBuilder {
    this.computer.setPowerSupply(powerSupply);
    return this;
  }

  public build(): Computer {
    return this.computer;
  }
}
