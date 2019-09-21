import {
  VectorRenderer,
  RasterRenderer,
  ThreeDRenderer,
  Circle,
  Square,
  Triangle,
  ComplexShape
} from './Bridge';

describe('Bridge Pattern', () => {
  // Test different renderers
  describe('Renderers', () => {
    const x = 10;
    const y = 20;

    describe('VectorRenderer', () => {
      const renderer = new VectorRenderer();

      it('should render circle correctly', () => {
        const result = renderer.renderCircle(5, x, y);
        expect(result).toContain('vector graphics');
        expect(result).toContain('circle');
        expect(result).toContain(`(${x}, ${y})`);
      });

      it('should render square correctly', () => {
        const result = renderer.renderSquare(8, x, y);
        expect(result).toContain('vector graphics');
        expect(result).toContain('square');
        expect(result).toContain('size 8');
      });

      it('should render triangle correctly', () => {
        const result = renderer.renderTriangle(6, 4, x, y);
        expect(result).toContain('vector graphics');
        expect(result).toContain('triangle');
        expect(result).toContain('width 6');
        expect(result).toContain('height 4');
      });
    });

    describe('RasterRenderer', () => {
      const renderer = new RasterRenderer();

      it('should render circle correctly', () => {
        const result = renderer.renderCircle(5, x, y);
        expect(result).toContain('raster pixels');
        expect(result).toContain('circle');
      });

      it('should render square correctly', () => {
        const result = renderer.renderSquare(8, x, y);
        expect(result).toContain('raster pixels');
        expect(result).toContain('square');
      });
    });

    describe('ThreeDRenderer', () => {
      const renderer = new ThreeDRenderer();

      it('should render circle as sphere', () => {
        const result = renderer.renderCircle(5, x, y);
        expect(result).toContain('3D sphere');
      });

      it('should render square as cube', () => {
        const result = renderer.renderSquare(8, x, y);
        expect(result).toContain('3D cube');
      });

      it('should render triangle as pyramid', () => {
        const result = renderer.renderTriangle(6, 4, x, y);
        expect(result).toContain('3D pyramid');
      });
    });
  });

  // Test shape abstractions
  describe('Shapes', () => {
    describe('Circle', () => {
      it('should work with VectorRenderer', () => {
        const renderer = new VectorRenderer();
        const circle = new Circle(renderer, 5, 10, 20);

        expect(circle.draw()).toContain('vector graphics');
        expect(circle.draw()).toContain('circle');
        expect(circle.draw()).toContain('radius 5');
      });

      it('should work with RasterRenderer', () => {
        const renderer = new RasterRenderer();
        const circle = new Circle(renderer, 7);

        expect(circle.draw()).toContain('raster pixels');
        expect(circle.draw()).toContain('circle');
        expect(circle.draw()).toContain('radius 7');
      });

      it('should resize correctly', () => {
        const renderer = new VectorRenderer();
        const circle = new Circle(renderer, 10);

        circle.resize(2);
        expect(circle.getRadius()).toBe(20);

        circle.resize(0.5);
        expect(circle.getRadius()).toBe(10);
      });

      it('should move correctly', () => {
        const renderer = new VectorRenderer();
        const circle = new Circle(renderer, 5, 0, 0);

        circle.move(10, 20);
        const position = circle.getPosition();
        expect(position.x).toBe(10);
        expect(position.y).toBe(20);
      });
    });

    describe('Square', () => {
      it('should work with different renderers', () => {
        const vectorRenderer = new VectorRenderer();
        const rasterRenderer = new RasterRenderer();
        const threeDRenderer = new ThreeDRenderer();

        const vectorSquare = new Square(vectorRenderer, 8);
        const rasterSquare = new Square(rasterRenderer, 8);
        const threeDSquare = new Square(threeDRenderer, 8);

        expect(vectorSquare.draw()).toContain('vector graphics');
        expect(rasterSquare.draw()).toContain('raster pixels');
        expect(threeDSquare.draw()).toContain('3D cube');
      });

      it('should resize correctly', () => {
        const renderer = new VectorRenderer();
        const square = new Square(renderer, 10);

        square.resize(2);
        expect(square.getSize()).toBe(20);
      });
    });

    describe('Triangle', () => {
      it('should work with different renderers', () => {
        const vectorRenderer = new VectorRenderer();
        const triangle = new Triangle(vectorRenderer, 10, 5);

        expect(triangle.draw()).toContain('triangle');
        expect(triangle.draw()).toContain('width 10');
        expect(triangle.draw()).toContain('height 5');
      });

      it('should resize correctly', () => {
        const renderer = new VectorRenderer();
        const triangle = new Triangle(renderer, 10, 5);

        triangle.resize(2);
        const dimensions = triangle.getDimensions();
        expect(dimensions.width).toBe(20);
        expect(dimensions.height).toBe(10);
      });
    });
  });

  // Test composition with ComplexShape
  describe('ComplexShape', () => {
    it('should combine multiple shapes with the same renderer', () => {
      const renderer = new VectorRenderer();
      const complex = new ComplexShape(renderer, 'Test Composition');

      complex.addShape(new Circle(renderer, 5));
      complex.addShape(new Square(renderer, 10));
      complex.addShape(new Triangle(renderer, 8, 6));

      const result = complex.draw();
      expect(result).toContain('Test Composition');
      expect(result).toContain('3 elements');
      expect(result).toContain('circle');
      expect(result).toContain('square');
      expect(result).toContain('triangle');
    });

    it('should resize all contained shapes', () => {
      const renderer = new VectorRenderer();
      const complex = new ComplexShape(renderer);

      const circle = new Circle(renderer, 5);
      const square = new Square(renderer, 10);

      complex.addShape(circle);
      complex.addShape(square);

      complex.resize(2);

      expect(circle.getRadius()).toBe(10);
      expect(square.getSize()).toBe(20);
    });

    it('should support adding and removing shapes', () => {
      const renderer = new VectorRenderer();
      const complex = new ComplexShape(renderer);

      const circle = new Circle(renderer, 5);
      const square = new Square(renderer, 10);

      complex.addShape(circle);
      expect(complex.getShapeCount()).toBe(1);

      complex.addShape(square);
      expect(complex.getShapeCount()).toBe(2);

      complex.removeShape(circle);
      expect(complex.getShapeCount()).toBe(1);

      // Draw should only include the square now
      const result = complex.draw();
      expect(result).toContain('square');
      expect(result).not.toContain('circle');
    });
  });

  // Test interchangeability of renderers
  describe('Interchangeability', () => {
    it('should allow changing renderers for the same shape type', () => {
      const vectorRenderer = new VectorRenderer();
      const rasterRenderer = new RasterRenderer();
      const threeDRenderer = new ThreeDRenderer();

      // Create a circle with vector rendering
      const circle = new Circle(vectorRenderer, 5);
      expect(circle.draw()).toContain('vector graphics');

      // Change to a new circle with raster rendering
      const circle2 = new Circle(rasterRenderer, 5);
      expect(circle2.draw()).toContain('raster pixels');

      // Change to a new circle with 3D rendering
      const circle3 = new Circle(threeDRenderer, 5);
      expect(circle3.draw()).toContain('3D sphere');
    });
  });
});
