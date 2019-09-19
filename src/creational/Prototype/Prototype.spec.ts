import {
  Shape,
  Circle,
  Rectangle,
  CircleMetadata,
  RectangleMetadata,
  ShapeRegistry
} from './Prototype';

describe('Prototype Pattern', () => {
  describe('Basic Shape cloning', () => {
    it('should clone a Shape correctly', () => {
      const original = new Shape(10, 20, 'red');
      const clone = original.clone();

      // Check that the clone has the same properties
      expect(clone.getX()).toBe(10);
      expect(clone.getY()).toBe(20);
      expect(clone.getColor()).toBe('red');

      // Verify it's a distinct instance
      original.move(30, 40);
      expect(original.getX()).toBe(30);
      expect(clone.getX()).toBe(10); // Clone should not be affected
    });
  });

  describe('Deep cloning with Circle', () => {
    it('should deep clone a Circle with its metadata', () => {
      const metadata = new CircleMetadata(new Date(2023, 0, 1)); // January 1, 2023
      const original = new Circle(5, 5, 'blue', 15, metadata);
      const clone = original.clone();

      // Check basic properties
      expect(clone.getRadius()).toBe(15);
      expect(clone.getColor()).toBe('blue');

      // Check that metadata was cloned (not just referenced)
      expect(clone.getMetadata()).not.toBe(metadata); // Different instance
      expect(clone.getMetadata().getCreatedAt().getTime()).toBe(metadata.getCreatedAt().getTime()); // Same value

      // Modify original metadata and verify clone isn't affected
      const newDate = new Date(2024, 0, 1); // January 1, 2024
      Object.defineProperty(metadata, 'createdAt', {value: newDate});
      expect(original.getMetadata().getCreatedAt()).toBe(newDate);
      expect(clone.getMetadata().getCreatedAt().getFullYear()).toBe(2023); // Clone should still have 2023
    });
  });

  describe('Deep cloning with Rectangle', () => {
    it('should deep clone a Rectangle with its metadata', () => {
      const metadata = new RectangleMetadata('User A');
      const original = new Rectangle(10, 10, 'green', 100, 50, metadata);
      const clone = original.clone();

      // Check basic properties
      expect(clone.getWidth()).toBe(100);
      expect(clone.getHeight()).toBe(50);

      // Check that metadata was cloned (not just referenced)
      expect(clone.getMetadata()).not.toBe(metadata); // Different instance
      expect(clone.getMetadata().getCreatedBy()).toBe('User A'); // Same value

      // Modify original metadata and verify the clone isn't affected
      Object.defineProperty(metadata, 'createdBy', {value: 'User B'});
      expect(original.getMetadata().getCreatedBy()).toBe('User B');
      expect(clone.getMetadata().getCreatedBy()).toBe('User A'); // Clone should not be affected
    });
  });

  describe('ShapeRegistry', () => {
    beforeEach(() => {
      // Clear registry before each test
      ShapeRegistry['items'] = new Map<string, Shape>();
    });

    it('should store and retrieve prototype copies', () => {
      // Set up prototypes
      const circlePrototype = new Circle(
        0, 0, 'red', 10, new CircleMetadata(new Date())
      );

      const rectanglePrototype = new Rectangle(
        0, 0, 'blue', 20, 10, new RectangleMetadata('System')
      );

      // Register prototypes
      ShapeRegistry.addItem('circle', circlePrototype);
      ShapeRegistry.addItem('rectangle', rectanglePrototype);

      // Retrieve and verify
      const retrievedCircle = ShapeRegistry.getItem('circle') as Circle;
      const retrievedRectangle = ShapeRegistry.getItem('rectangle') as Rectangle;

      expect(retrievedCircle).not.toBe(circlePrototype); // Different instance
      expect(retrievedRectangle).not.toBe(rectanglePrototype); // Different instance

      expect(retrievedCircle.getRadius()).toBe(10);
      expect(retrievedRectangle.getWidth()).toBe(20);
      expect(retrievedRectangle.getHeight()).toBe(10);

      // Check keys
      expect(ShapeRegistry.getRegisteredKeys()).toContain('circle');
      expect(ShapeRegistry.getRegisteredKeys()).toContain('rectangle');
      expect(ShapeRegistry.getRegisteredKeys().length).toBe(2);
    });

    it('should return undefined for non-existent keys', () => {
      expect(ShapeRegistry.getItem('nonexistent')).toBeUndefined();
    });
  });

  describe('Practical usage examples', () => {
    it('should allow creating variations efficiently', () => {
      // Create a base prototype
      const baseCircle = new Circle(
        100, 100, 'blue', 50, new CircleMetadata(new Date())
      );

      // Clone and modify to create variations
      const largeCircle = baseCircle.clone();
      Object.defineProperty(largeCircle, 'radius', {value: 100});

      const redCircle = baseCircle.clone();
      Object.defineProperty(redCircle, 'color', {value: 'red'});

      // Verify they're different objects with the right properties
      expect(largeCircle.getRadius()).toBe(100);
      expect(largeCircle.getColor()).toBe('blue');

      expect(redCircle.getRadius()).toBe(50);
      expect(redCircle.getColor()).toBe('red');

      // The original prototype should be unchanged
      expect(baseCircle.getRadius()).toBe(50);
      expect(baseCircle.getColor()).toBe('blue');
    });
  });
});
