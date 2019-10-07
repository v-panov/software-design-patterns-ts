/**
 * Template Method Pattern
 * Defines the skeleton of an algorithm in a method, deferring some steps to subclasses.
 * Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.
 */

// Abstract class with template method
export abstract class AbstractClass {
  /**
   * The template method defines the skeleton of an algorithm.
   */
  public templateMethod(): string {
    const result: string[] = [];

    result.push(this.baseOperation1());
    result.push(this.requiredOperation1());
    result.push(this.baseOperation2());
    result.push(this.hook1() ? this.requiredOperation2() : 'Skipped operation 2');
    result.push(this.baseOperation3());
    result.push(this.hook2() ? 'Hook 2 enabled' : 'Hook 2 disabled');

    return result.join('\n');
  }

  /**
   * These operations already have implementations.
   */
  protected baseOperation1(): string {
    return 'AbstractClass: Base operation 1';
  }

  protected baseOperation2(): string {
    return 'AbstractClass: Base operation 2';
  }

  protected baseOperation3(): string {
    return 'AbstractClass: Base operation 3';
  }

  /**
   * These operations have to be implemented by subclasses.
   */
  protected abstract requiredOperation1(): string;

  protected abstract requiredOperation2(): string;

  /**
   * Hooks are optional - subclasses may override them, but it's not mandatory.
   * Hooks provide additional extension points in some crucial places of the algorithm.
   */
  protected hook1(): boolean {
    return true; // Default implementation
  }

  protected hook2(): boolean {
    return true; // Default implementation
  }
}

// Concrete implementations
export class ConcreteClass1 extends AbstractClass {
  protected requiredOperation1(): string {
    return 'ConcreteClass1: Implemented required operation 1';
  }

  protected requiredOperation2(): string {
    return 'ConcreteClass1: Implemented required operation 2';
  }
}

export class ConcreteClass2 extends AbstractClass {
  protected requiredOperation1(): string {
    return 'ConcreteClass2: Implemented required operation 1';
  }

  protected requiredOperation2(): string {
    return 'ConcreteClass2: Implemented required operation 2';
  }

  // Overriding hooks to customize behavior
  protected hook1(): boolean {
    return false; // Skip requiredOperation2
  }
}

// More practical example: Data Processing Pipeline
export abstract class DataProcessor {
  // Template method defining the data processing algorithm
  public processData(data: string): string {
    let result = data;

    // Step 1: Validate the data
    this.validateData(result);

    // Step 2: Preprocess the data
    result = this.preProcessData(result);

    // Step 3: Transform the data (required implementation)
    result = this.transformData(result);

    // Step 4: Filter the data (optional hook)
    if (this.shouldFilter()) {
      result = this.filterData(result);
    }

    // Step 5: Format the data (required implementation)
    result = this.formatData(result);

    // Step 6: Post-process (optional hook)
    if (this.shouldPostProcess()) {
      result = this.postProcessData(result);
    }

    return result;
  }

  // Base operations with default implementations
  protected validateData(data: string): void {
    if (!data || data.trim() === '') {
      throw new Error('Data cannot be empty');
    }
  }

  protected preProcessData(data: string): string {
    // Default preprocessing: trim whitespace
    return data.trim();
  }

  protected filterData(data: string): string {
    // Default implementation does nothing
    return data;
  }

  protected postProcessData(data: string): string {
    // Default implementation does nothing
    return data;
  }

  // Hooks with default implementations
  protected shouldFilter(): boolean {
    return false;
  }

  protected shouldPostProcess(): boolean {
    return false;
  }

  // Abstract methods that must be implemented by subclasses
  protected abstract transformData(data: string): string;

  protected abstract formatData(data: string): string;
}

// Concrete implementation for CSV data processing
export class CSVProcessor extends DataProcessor {
  protected transformData(data: string): string {
    // Convert CSV to normalized format
    const lines = data.split('\n');
    const header = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const entry: Record<string, string> = {};

      for (let j = 0; j < header.length; j++) {
        entry[header[j]] = values[j] || '';
      }

      result.push(entry);
    }

    return JSON.stringify(result);
  }

  protected formatData(data: string): string {
    // Format JSON for readable output
    return JSON.stringify(JSON.parse(data), null, 2);
  }

  // Override hook to enable filtering
  protected shouldFilter(): boolean {
    return true;
  }

  // Override filter implementation
  protected filterData(data: string): string {
    // Filter out empty entries
    const parsed = JSON.parse(data);
    const filtered = parsed.filter((item: Record<string, string>) => {
      return Object.values(item).some(value => value !== '');
    });
    return JSON.stringify(filtered);
  }
}

// Concrete implementation for XML data processing
export class XMLProcessor extends DataProcessor {
  private convertXMLToJSON(xml: string): any {
    // Simplified XML to JSON conversion (in a real app, use a proper XML parser)
    const result: Record<string, any> = {};
    const matches = xml.match(/<(\w+)>([^<]+)<\/\1>/g) || [];

    for (const match of matches) {
      const tagMatch = match.match(/<(\w+)>([^<]+)<\/\1>/);
      if (tagMatch) {
        const [, tag, value] = tagMatch;
        result[tag] = value;
      }
    }

    return result;
  }

  protected transformData(data: string): string {
    // Convert XML to JSON
    const jsonData = this.convertXMLToJSON(data);
    return JSON.stringify(jsonData);
  }

  protected formatData(data: string): string {
    // Add XML formatting information
    const jsonData = JSON.parse(data);
    jsonData.format = 'XML';
    jsonData.timestamp = new Date().toISOString();
    return JSON.stringify(jsonData, null, 2);
  }

  // Override with custom preprocessing
  protected preProcessData(data: string): string {
    // Remove XML comments
    return data.replace(/<!--[\s\S]*?-->/g, '').trim();
  }

  // Enable post-processing
  protected shouldPostProcess(): boolean {
    return true;
  }

  // Custom post-processing
  protected postProcessData(data: string): string {
    const jsonData = JSON.parse(data);
    jsonData.processed = true;
    return JSON.stringify(jsonData, null, 2);
  }
}
