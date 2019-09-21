/**
 * Bridge Pattern
 * Decouples an abstraction from its implementation so that the two can vary independently.
 */

// Implementation interface
export interface Renderer {
  renderCircle(radius: number, x: number, y: number): string;

  renderSquare(size: number, x: number, y: number): string;

  renderTriangle(width: number, height: number, x: number, y: number): string;
}

// Concrete Implementations
export class VectorRenderer implements Renderer {
  public renderCircle(radius: number, x: number, y: number): string {
    return `Drawing a circle with vector graphics at (${x}, ${y}) with radius ${radius}`;
  }

  public renderSquare(size: number, x: number, y: number): string {
    return `Drawing a square with vector graphics at (${x}, ${y}) with size ${size}`;
  }

  public renderTriangle(width: number, height: number, x: number, y: number): string {
    return `Drawing a triangle with vector graphics at (${x}, ${y}) with width ${width} and height ${height}`;
  }
}

export class RasterRenderer implements Renderer {
  public renderCircle(radius: number, x: number, y: number): string {
    return `Drawing a circle with raster pixels at (${x}, ${y}) with radius ${radius}`;
  }

  public renderSquare(size: number, x: number, y: number): string {
    return `Drawing a square with raster pixels at (${x}, ${y}) with size ${size}`;
  }

  public renderTriangle(width: number, height: number, x: number, y: number): string {
    return `Drawing a triangle with raster pixels at (${x}, ${y}) with width ${width} and height ${height}`;
  }
}

export class ThreeDRenderer implements Renderer {
  public renderCircle(radius: number, x: number, y: number): string {
    return `Rendering a 3D sphere at (${x}, ${y}, 0) with radius ${radius}`;
  }

  public renderSquare(size: number, x: number, y: number): string {
    return `Rendering a 3D cube at (${x}, ${y}, 0) with size ${size}`;
  }

  public renderTriangle(width: number, height: number, x: number, y: number): string {
    return `Rendering a 3D pyramid at (${x}, ${y}, 0) with base width ${width} and height ${height}`;
  }
}

// Abstraction
export abstract class Shape {
  protected renderer: Renderer;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  public abstract draw(): string;

  public abstract resize(factor: number): void;
}

// Refined Abstractions
export class Circle extends Shape {
  private radius: number;
  private x: number;
  private y: number;

  constructor(renderer: Renderer, radius: number, x: number = 0, y: number = 0) {
    super(renderer);
    this.radius = radius;
    this.x = x;
    this.y = y;
  }

  public draw(): string {
    return this.renderer.renderCircle(this.radius, this.x, this.y);
  }

  public resize(factor: number): void {
    this.radius *= factor;
  }

  public getRadius(): number {
    return this.radius;
  }

  public getPosition(): { x: number; y: number } {
    return {x: this.x, y: this.y};
  }

  public move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class Square extends Shape {
  private size: number;
  private x: number;
  private y: number;

  constructor(renderer: Renderer, size: number, x: number = 0, y: number = 0) {
    super(renderer);
    this.size = size;
    this.x = x;
    this.y = y;
  }

  public draw(): string {
    return this.renderer.renderSquare(this.size, this.x, this.y);
  }

  public resize(factor: number): void {
    this.size *= factor;
  }

  public getSize(): number {
    return this.size;
  }

  public getPosition(): { x: number; y: number } {
    return {x: this.x, y: this.y};
  }

  public move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class Triangle extends Shape {
  private width: number;
  private height: number;
  private x: number;
  private y: number;

  constructor(renderer: Renderer, width: number, height: number, x: number = 0, y: number = 0) {
    super(renderer);
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  public draw(): string {
    return this.renderer.renderTriangle(this.width, this.height, this.x, this.y);
  }

  public resize(factor: number): void {
    this.width *= factor;
    this.height *= factor;
  }

  public getDimensions(): { width: number; height: number } {
    return {width: this.width, height: this.height};
  }

  public getPosition(): { x: number; y: number } {
    return {x: this.x, y: this.y};
  }

  public move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

// Composition of shapes
export class ComplexShape extends Shape {
  private shapes: Shape[] = [];
  private name: string;

  constructor(renderer: Renderer, name: string = 'Complex Shape') {
    super(renderer);
    this.name = name;
  }

  public addShape(shape: Shape): void {
    this.shapes.push(shape);
  }

  public removeShape(shape: Shape): void {
    const index = this.shapes.indexOf(shape);
    if (index !== -1) {
      this.shapes.splice(index, 1);
    }
  }

  public draw(): string {
    let result = `Drawing complex shape "${this.name}" with ${this.shapes.length} elements:\n`;
    this.shapes.forEach((shape, index) => {
      result += `  ${index + 1}. ${shape.draw()}\n`;
    });
    return result;
  }

  public resize(factor: number): void {
    this.shapes.forEach(shape => shape.resize(factor));
  }

  public getName(): string {
    return this.name;
  }

  public getShapeCount(): number {
    return this.shapes.length;
  }
}
