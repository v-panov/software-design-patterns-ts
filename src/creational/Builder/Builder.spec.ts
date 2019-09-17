import {
  Computer,
  ConcreteComputerBuilder,
  ComputerDirector,
  FluentComputerBuilder
} from './Builder';

describe('Builder Pattern', () => {
  describe('Computer', () => {
    it('should create a computer with specifications', () => {
      const computer = new Computer();
      computer.setCpu('Intel i7');
      computer.setRam('16GB');
      computer.setStorage('512GB');
      computer.setMotherboard('ASUS');
      computer.setPowerSupply('600W');

      const specs = computer.getSpecifications();
      expect(specs).toContain('Intel i7');
      expect(specs).toContain('16GB');
      expect(specs).toContain('512GB');
      expect(specs).toContain('ASUS');
      expect(specs).toContain('600W');
    });

    it('should check if computer is complete', () => {
      const computer = new Computer();
      expect(computer.isComplete()).toBe(false);

      computer.setCpu('Intel i7');
      computer.setRam('16GB');
      computer.setStorage('512GB');
      computer.setMotherboard('ASUS');
      computer.setPowerSupply('600W');

      expect(computer.isComplete()).toBe(true);
    });

    it('should handle missing specifications', () => {
      const computer = new Computer();
      const specs = computer.getSpecifications();

      expect(specs).toContain('Not specified');
    });
  });

  describe('ConcreteComputerBuilder', () => {
    let builder: ConcreteComputerBuilder;

    beforeEach(() => {
      builder = new ConcreteComputerBuilder();
    });

    it('should build a computer using method chaining', () => {
      const computer = builder
        .setCpu('AMD Ryzen 7')
        .setRam('16GB')
        .setStorage('1TB')
        .setGpu('NVIDIA')
        .setMotherboard('MSI')
        .setPowerSupply('750W')
        .build();

      const specs = computer.getSpecifications();
      expect(specs).toContain('AMD Ryzen 7');
      expect(specs).toContain('16GB');
      expect(specs).toContain('1TB');
      expect(specs).toContain('NVIDIA');
      expect(specs).toContain('MSI');
      expect(specs).toContain('750W');
    });

    it('should reset builder after build', () => {
      const computer1 = builder
        .setCpu('Intel i5')
        .setRam('16GB')
        .build();

      const computer2 = builder
        .setCpu('AMD Ryzen 5')
        .build();

      expect(computer1.getSpecifications()).toContain('Intel i5');
      expect(computer2.getSpecifications()).toContain('AMD Ryzen 5');
      expect(computer2.getSpecifications()).not.toContain('Intel i5');
    });
  });

  describe('ComputerDirector', () => {
    let director: ComputerDirector;
    let builder: ConcreteComputerBuilder;

    beforeEach(() => {
      builder = new ConcreteComputerBuilder();
      director = new ComputerDirector(builder);
    });

    it('should build a gaming computer', () => {
      const gamingComputer = director.buildGamingComputer();
      const specs = gamingComputer.getSpecifications();

      expect(specs).toContain('Intel i7');
      expect(specs).toContain('32GB');
      expect(specs).toContain('1TB');
      expect(specs).toContain('NVIDIA');
      expect(specs).toContain('ASUS');
      expect(specs).toContain('750W 80+ Gold');
      expect(gamingComputer.isComplete()).toBe(true);
    });

    it('should build an office computer', () => {
      const officeComputer = director.buildOfficeComputer();
      const specs = officeComputer.getSpecifications();

      expect(specs).toContain('Intel i5');
      expect(specs).toContain('16GB');
      expect(specs).toContain('512GB');
      expect(specs).toContain('MSI');
      expect(specs).toContain('500W 80+ Bronze');
      expect(officeComputer.isComplete()).toBe(true);
    });

    it('should build a budget computer', () => {
      const budgetComputer = director.buildBudgetComputer();
      const specs = budgetComputer.getSpecifications();

      expect(specs).toContain('AMD Ryzen 3');
      expect(specs).toContain('8GB');
      expect(specs).toContain('256GB');
      expect(specs).toContain('ASRock');
      expect(specs).toContain('400W');
      expect(budgetComputer.isComplete()).toBe(true);
    });
  });

  describe('FluentComputerBuilder', () => {
    it('should build a computer using fluent interface', () => {
      const computer = FluentComputerBuilder.create()
        .withCpu('Intel i7')
        .withRam('16GB')
        .withStorage('1TB')
        .withGpu('NVIDIA')
        .withMotherboard('ASUS Gaming')
        .withPowerSupply('650W')
        .build();

      const specs = computer.getSpecifications();
      expect(specs).toContain('Intel i7');
      expect(specs).toContain('16GB');
      expect(specs).toContain('1TB');
      expect(specs).toContain('NVIDIA');
      expect(specs).toContain('ASUS Gaming');
      expect(specs).toContain('650W');
    });

    it('should allow partial builds', () => {
      const computer = FluentComputerBuilder.create()
        .withCpu('Intel i3')
        .withRam('8GB')
        .build();

      const specs = computer.getSpecifications();
      expect(specs).toContain('Intel i3');
      expect(specs).toContain('8GB');
      expect(specs).toContain('Not specified'); // For missing components
      expect(computer.isComplete()).toBe(false);
    });

    it('should create new instances with static create method', () => {
      const builder1 = FluentComputerBuilder.create();
      const builder2 = FluentComputerBuilder.create();

      expect(builder1).not.toBe(builder2);
    });
  });
});
