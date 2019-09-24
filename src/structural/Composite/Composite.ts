/**
 * Composite Pattern
 * Composes objects into tree structures to represent part-whole hierarchies.
 * Lets clients treat individual objects and compositions of objects uniformly.
 */

// Component interface - declares operations common to both simple and complex objects
export interface FileSystemComponent {
  getName(): string;

  getSize(): number; // in bytes
  getPath(): string;

  getCreationDate(): Date;

  print(indent?: string): string;

  search(keyword: string): FileSystemComponent[];

  addComponent?(component: FileSystemComponent): void;

  removeComponent?(component: FileSystemComponent): boolean;

  getChild?(name: string): FileSystemComponent | null;
}

// Leaf class - represents a file
export class File implements FileSystemComponent {
  private name: string;
  private size: number;
  private content: string;
  private parentPath: string;
  private creationDate: Date;

  constructor(name: string, size: number, content: string = '', parentPath: string = '') {
    this.name = name;
    this.size = size;
    this.content = content;
    this.parentPath = parentPath;
    this.creationDate = new Date();
  }

  public getName(): string {
    return this.name;
  }

  public getSize(): number {
    return this.size;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
    // Update size based on content (simplified)
    this.size = content.length;
  }

  public getPath(): string {
    return this.parentPath ? `${this.parentPath}/${this.name}` : this.name;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public print(indent: string = ''): string {
    return `${indent}File: ${this.name} (${this.size} bytes)`;
  }

  public search(keyword: string): FileSystemComponent[] {
    if (this.name.includes(keyword) || this.content.includes(keyword)) {
      return [this];
    }
    return [];
  }
}

// Composite class - represents a directory
export class Directory implements FileSystemComponent {
  private name: string;
  private components: Map<string, FileSystemComponent>;
  private parentPath: string;
  private creationDate: Date;

  constructor(name: string, parentPath: string = '') {
    this.name = name;
    this.components = new Map<string, FileSystemComponent>();
    this.parentPath = parentPath;
    this.creationDate = new Date();
  }

  public getName(): string {
    return this.name;
  }

  public getSize(): number {
    let totalSize = 0;
    this.components.forEach(component => {
      totalSize += component.getSize();
    });
    return totalSize;
  }

  public getPath(): string {
    return this.parentPath ? `${this.parentPath}/${this.name}` : this.name;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public addComponent(component: FileSystemComponent): void {
    this.components.set(component.getName(), component);
  }

  public removeComponent(component: FileSystemComponent): boolean {
    return this.components.delete(component.getName());
  }

  public getChild(name: string): FileSystemComponent | null {
    return this.components.get(name) || null;
  }

  public print(indent: string = ''): string {
    let output = `${indent}Directory: ${this.name} (${this.getSize()} bytes)\n`;

    this.components.forEach(component => {
      output += component.print(indent + '  ') + '\n';
    });

    // Remove the last newline
    return output.substring(0, output.length - 1);
  }

  public search(keyword: string): FileSystemComponent[] {
    const result: FileSystemComponent[] = [];

    // Add this directory if its name matches
    if (this.name.includes(keyword)) {
      result.push(this);
    }

    // Search in all child components
    this.components.forEach(component => {
      result.push(...component.search(keyword));
    });

    return result;
  }

  public getComponentCount(): number {
    return this.components.size;
  }
}

// Another Composite example - graphical shapes

// Component interface
export interface Graphic {
  move(x: number, y: number): void;

  draw(): string;

  getPosition(): { x: number; y: number };

  getBounds(): { x: number; y: number; width: number; height: number };
}

// Leaf implementation
export class Circle implements Graphic {
  private x: number;
  private y: number;
  private radius: number;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  public move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public draw(): string {
    return `Circle at (${this.x}, ${this.y}) with radius ${this.radius}`;
  }

  public getPosition(): { x: number; y: number } {
    return {x: this.x, y: this.y};
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    // For a circle, the bounds are a square around the circle
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }

  public getRadius(): number {
    return this.radius;
  }
}

// Another leaf implementation
export class Rectangle implements Graphic {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public draw(): string {
    return `Rectangle at (${this.x}, ${this.y}) with width ${this.width} and height ${this.height}`;
  }

  public getPosition(): { x: number; y: number } {
    return {x: this.x, y: this.y};
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public getSize(): { width: number; height: number } {
    return {width: this.width, height: this.height};
  }
}

// Composite implementation
export class CompositeGraphic implements Graphic {
  private x: number;
  private y: number;
  private graphics: Graphic[] = [];

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public move(x: number, y: number): void {
    // Calculate the delta to move all children relative to their current positions
    const deltaX = x - this.x;
    const deltaY = y - this.y;

    // Update the group's position
    this.x = x;
    this.y = y;

    // Move all child graphics by the same delta
    this.graphics.forEach(graphic => {
      const currentPos = graphic.getPosition();
      graphic.move(currentPos.x + deltaX, currentPos.y + deltaY);
    });
  }

  public draw(): string {
    let result = `Composite at (${this.x}, ${this.y}) with ${this.graphics.length} elements:\n`;
    this.graphics.forEach((graphic, index) => {
      result += `  ${index + 1}. ${graphic.draw()}\n`;
    });
    return result.trim();
  }

  public getPosition(): { x: number; y: number } {
    return {x: this.x, y: this.y};
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    if (this.graphics.length === 0) {
      return {x: this.x, y: this.y, width: 0, height: 0};
    }

    // Initialize with the first graphic's bounds
    const firstBounds = this.graphics[0].getBounds();
    let minX = firstBounds.x;
    let minY = firstBounds.y;
    let maxX = firstBounds.x + firstBounds.width;
    let maxY = firstBounds.y + firstBounds.height;

    // Find the bounding box that contains all graphics
    for (let i = 1; i < this.graphics.length; i++) {
      const bounds = this.graphics[i].getBounds();
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  public add(graphic: Graphic): void {
    this.graphics.push(graphic);
  }

  public remove(graphic: Graphic): boolean {
    const index = this.graphics.indexOf(graphic);
    if (index >= 0) {
      this.graphics.splice(index, 1);
      return true;
    }
    return false;
  }

  public getGraphics(): Graphic[] {
    return [...this.graphics];
  }

  public clear(): void {
    this.graphics = [];
  }

  public getGraphicCount(): number {
    return this.graphics.length;
  }
}
