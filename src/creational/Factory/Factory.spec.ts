import {
  Book,
  Electronics,
  Clothing,
  ProductType,
  ProductFactory,
  FlexibleProductFactory
} from './Factory';

describe('Factory Pattern', () => {
  describe('ProductFactory', () => {
    it('should create a Book product', () => {
      const book = ProductFactory.createProduct(ProductType.BOOK, 'The Great Gatsby', 15.99, 'F. Scott Fitzgerald');

      expect(book).toBeInstanceOf(Book);
      expect(book.getName()).toBe('The Great Gatsby');
      expect(book.getPrice()).toBe(15.99);
      expect(book.getDescription()).toBe('Book: The Great Gatsby by F. Scott Fitzgerald');
    });

    it('should create an Electronics product', () => {
      const electronics = ProductFactory.createProduct(ProductType.ELECTRONICS, 'iPhone X', 699.99, 'Apple');

      expect(electronics).toBeInstanceOf(Electronics);
      expect(electronics.getName()).toBe('iPhone X');
      expect(electronics.getPrice()).toBe(699.99);
      expect(electronics.getDescription()).toBe('Electronics: iPhone X by Apple');
    });

    it('should create a Clothing product', () => {
      const clothing = ProductFactory.createProduct(ProductType.CLOTHING, 'T-Shirt', 29.99, 'L');

      expect(clothing).toBeInstanceOf(Clothing);
      expect(clothing.getName()).toBe('T-Shirt');
      expect(clothing.getPrice()).toBe(29.99);
      expect(clothing.getDescription()).toBe('Clothing: T-Shirt (Size: L)');
    });

    it('should throw error for unknown product type', () => {
      expect(() => {
        ProductFactory.createProduct('unknown' as ProductType, 'test', 10, 'test');
      }).toThrow('Unknown product type: unknown');
    });
  });

  describe('FlexibleProductFactory', () => {
    beforeEach(() => {
      // Clear any existing registrations
      const factory = FlexibleProductFactory as any;
      factory.creators = new Map();
    });

    it('should register and create products using registered creators', () => {
      FlexibleProductFactory.registerCreator('book', (title: string, price: number, author: string) =>
        new Book(title, price, author)
      );

      const book = FlexibleProductFactory.createProduct('book', 'Test Book', 20.00, 'Test Author');

      expect(book).toBeInstanceOf(Book);
      expect(book.getName()).toBe('Test Book');
      expect(book.getPrice()).toBe(20.00);
      expect(book.getDescription()).toBe('Book: Test Book by Test Author');
    });

    it('should return registered types', () => {
      FlexibleProductFactory.registerCreator('book', (title: string, price: number, author: string) =>
        new Book(title, price, author)
      );
      FlexibleProductFactory.registerCreator('electronics', (name: string, price: number, brand: string) =>
        new Electronics(name, price, brand)
      );

      const types = FlexibleProductFactory.getRegisteredTypes();

      expect(types).toContain('book');
      expect(types).toContain('electronics');
      expect(types).toHaveLength(2);
    });

    it('should throw error for unregistered product type', () => {
      expect(() => {
        FlexibleProductFactory.createProduct('unregistered', 'test', 10, 'test');
      }).toThrow('No creator registered for type: unregistered');
    });

    it('should allow overriding existing creators', () => {
      // Register initial creator
      FlexibleProductFactory.registerCreator('test', () => new Book('Initial', 10, 'Author'));

      // Override with new creator
      FlexibleProductFactory.registerCreator('test', () => new Book('Override', 20, 'New Author'));

      const product = FlexibleProductFactory.createProduct('test');

      expect(product.getName()).toBe('Override');
      expect(product.getPrice()).toBe(20);
    });
  });
});
