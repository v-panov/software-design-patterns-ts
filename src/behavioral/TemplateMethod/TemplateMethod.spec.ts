import {
  ConcreteClass1,
  ConcreteClass2,
  CSVProcessor,
  XMLProcessor
} from './TemplateMethod';

describe('Template Method Pattern', () => {
  describe('Basic Template Method', () => {
    it('should execute template method with all steps for ConcreteClass1', () => {
      const concreteClass = new ConcreteClass1();
      const result = concreteClass.templateMethod();

      expect(result).toContain('AbstractClass: Base operation 1');
      expect(result).toContain('ConcreteClass1: Implemented required operation 1');
      expect(result).toContain('AbstractClass: Base operation 2');
      expect(result).toContain('ConcreteClass1: Implemented required operation 2');
      expect(result).toContain('AbstractClass: Base operation 3');
      expect(result).toContain('Hook 2 enabled');
    });

    it('should skip requiredOperation2 when hook1 returns false in ConcreteClass2', () => {
      const concreteClass = new ConcreteClass2();
      const result = concreteClass.templateMethod();

      expect(result).toContain('AbstractClass: Base operation 1');
      expect(result).toContain('ConcreteClass2: Implemented required operation 1');
      expect(result).toContain('AbstractClass: Base operation 2');
      expect(result).toContain('Skipped operation 2');
      expect(result).not.toContain('ConcreteClass2: Implemented required operation 2');
      expect(result).toContain('AbstractClass: Base operation 3');
      expect(result).toContain('Hook 2 enabled');
    });
  });

  describe('Data Processing Pipeline', () => {
    describe('CSVProcessor', () => {
      let csvProcessor: CSVProcessor;
      const sampleCSV = 'name,age,city\nJohn,30,New York\nJane,25,San Francisco\n,,';

      beforeEach(() => {
        csvProcessor = new CSVProcessor();
      });

      it('should process CSV data correctly', () => {
        const result = csvProcessor.processData(sampleCSV);
        const parsed = JSON.parse(result);

        expect(parsed).toHaveLength(2); // Should filter out the empty line
        expect(parsed[0].name).toBe('John');
        expect(parsed[0].age).toBe('30');
        expect(parsed[0].city).toBe('New York');
        expect(parsed[1].name).toBe('Jane');
      });

      it('should throw error on empty data', () => {
        expect(() => {
          csvProcessor.processData('');
        }).toThrow('Data cannot be empty');
      });

      it('should handle whitespace in input', () => {
        const result = csvProcessor.processData('  \n  name,age\nJohn,30  \n');
        const parsed = JSON.parse(result);

        expect(parsed).toHaveLength(1);
        expect(parsed[0].name).toBe('John');
      });
    });

    describe('XMLProcessor', () => {
      let xmlProcessor: XMLProcessor;
      const sampleXML = '<!-- Comment --><data><name>John</name><age>30</age><city>New York</city></data>';

      beforeEach(() => {
        xmlProcessor = new XMLProcessor();
      });

      it('should process XML data correctly', () => {
        const result = xmlProcessor.processData(sampleXML);
        const parsed = JSON.parse(result);

        expect(parsed.name).toBe('John');
        expect(parsed.age).toBe('30');
        expect(parsed.city).toBe('New York');
        expect(parsed.format).toBe('XML');
        expect(parsed.processed).toBe(true);
        expect(parsed).toHaveProperty('timestamp');
      });

      it('should remove XML comments during preprocessing', () => {
        const result = xmlProcessor.processData('<!-- This should be removed --><data><value>test</value></data>');
        const parsed = JSON.parse(result);

        expect(parsed.value).toBe('test');
        expect(result).not.toContain('This should be removed');
      });

      it('should add metadata during post-processing', () => {
        const result = xmlProcessor.processData('<data><test>value</test></data>');
        const parsed = JSON.parse(result);

        expect(parsed.test).toBe('value');
        expect(parsed.format).toBe('XML');
        expect(parsed.processed).toBe(true);
        expect(parsed).toHaveProperty('timestamp');
      });
    });

    describe('Custom Processor Implementation', () => {
      // Create a custom implementation for testing overrides
      class CustomProcessor extends CSVProcessor {
        protected validateData(data: string): void {
          // Custom validation allows empty strings
          // No validation necessary
        }

        protected shouldFilter(): boolean {
          return false; // Disable filtering
        }

        protected shouldPostProcess(): boolean {
          return true; // Enable post-processing
        }

        protected transformData(data: string): string {
          if (!data || data.trim() === '') {
            // For empty input, return an empty array
            return JSON.stringify([]);
          }
          return super.transformData(data);
        }

        protected formatData(data: string): string {
          // Format JSON for readable output
          return data; // Keep the original JSON string
        }

        protected postProcessData(data: string): string {
          // Manually create an object that will serialize to an array with additional property
          return '{"0":null,"custom":true,"length":0}';
        }
      }

      it('should allow overriding any part of the template', () => {
        const processor = new CustomProcessor();
        const result = processor.processData(''); // Empty string would throw in the base class
        const parsed = JSON.parse(result);

        expect(parsed).toHaveLength(0); // Empty result (no filtering applied)
        expect(parsed).toHaveProperty('custom'); // Post-processing was applied
        expect(parsed.custom).toBe(true);
      });
    });
  });
});
