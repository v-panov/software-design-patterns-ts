/**
 * Prototype Pattern
 * Creates new objects by copying an existing object, known as the prototype.
 */

// Prototype interface
export interface Prototype<T> {
  clone(): T;
}

// Concrete prototype - basic
export class Shape implements Prototype<Shape> {
  private x: number;
  private y: number;
  private color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getColor(): string {
    return this.color;
  }

  public clone(): Shape {
    // Create a new instance and copy all properties
    return new Shape(this.x, this.y, this.color);
  }

  public move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public describe(): string {
    return `Shape at position (${this.x}, ${this.y}) with color ${this.color}`;
  }
}

// Concrete prototype with references to other objects
export class Circle extends Shape {
  private radius: number;
  private metadata: CircleMetadata;

  constructor(x: number, y: number, color: string, radius: number, metadata: CircleMetadata) {
    super(x, y, color);
    this.radius = radius;
    this.metadata = metadata;
  }

  public getRadius(): number {
    return this.radius;
  }

  public getMetadata(): CircleMetadata {
    return this.metadata;
  }

  // Override clone to handle deep copying
  public clone(): Circle {
    // Deep copy of the metadata object
    const metadataCopy = this.metadata.clone();
    return new Circle(this.getX(), this.getY(), this.getColor(), this.radius, metadataCopy);
  }

  public describe(): string {
    return `${super.describe()} and radius ${this.radius}. Created at: ${this.metadata.getCreatedAt()}`;
  }
}

// Another concrete prototype with references
export class Rectangle extends Shape {
  private width: number;
  private height: number;
  private metadata: RectangleMetadata;

  constructor(x: number, y: number, color: string, width: number, height: number, metadata: RectangleMetadata) {
    super(x, y, color);
    this.width = width;
    this.height = height;
    this.metadata = metadata;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getMetadata(): RectangleMetadata {
    return this.metadata;
  }

  // Override clone to handle deep copying
  public clone(): Rectangle {
    // Deep copy of the metadata object
    const metadataCopy = this.metadata.clone();
    return new Rectangle(this.getX(), this.getY(), this.getColor(), this.width, this.height, metadataCopy);
  }

  public describe(): string {
    return `${super.describe()}, width ${this.width}, and height ${this.height}. Created by: ${this.metadata.getCreatedBy()}`;
  }
}

// Supporting classes for demonstrating deep copying
export class CircleMetadata implements Prototype<CircleMetadata> {
  private createdAt: Date;

  constructor(createdAt?: Date) {
    this.createdAt = createdAt || new Date();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public clone(): CircleMetadata {
    // Create a new Date object to avoid reference sharing
    return new CircleMetadata(new Date(this.createdAt.getTime()));
  }
}

export class RectangleMetadata implements Prototype<RectangleMetadata> {
  private createdBy: string;

  constructor(createdBy: string) {
    this.createdBy = createdBy;
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public clone(): RectangleMetadata {
    return new RectangleMetadata(this.createdBy);
  }
}

// Prototype registry - maintains a set of ready-made prototypes
export class ShapeRegistry {
  private static items: Map<string, Shape> = new Map<string, Shape>();

  public static addItem(key: string, prototype: Shape): void {
    this.items.set(key, prototype);
  }

  public static getItem(key: string): Shape | undefined {
    const item = this.items.get(key);
    return item ? item.clone() : undefined;
  }

  public static getRegisteredKeys(): string[] {
    return Array.from(this.items.keys());
  }
}
