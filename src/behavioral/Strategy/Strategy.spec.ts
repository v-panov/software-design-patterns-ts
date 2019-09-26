import {
  CreditCardPayment,
  PayPalPayment,
  BankTransferPayment,
  CryptoPayment,
  PaymentProcessor,
  BubbleSortStrategy,
  QuickSortStrategy,
  MergeSortStrategy,
  SortContext,
  ZipCompressionStrategy,
  RarCompressionStrategy,
  CompressionContext
} from './Strategy';

describe('Strategy Pattern', () => {
  describe('Payment Strategies', () => {
    it('should process credit card payment', () => {
      const creditCard = new CreditCardPayment('1234567890123456', 'John Doe');
      const processor = new PaymentProcessor(creditCard);

      const result = processor.processPayment(100);

      expect(result).toBe('Paid $100 using Credit Card ending in 3456 (John Doe)');
    });

    it('should process PayPal payment', () => {
      const paypal = new PayPalPayment('john@example.com');
      const processor = new PaymentProcessor(paypal);

      const result = processor.processPayment(50);

      expect(result).toBe('Paid $50 using PayPal account john@example.com');
    });

    it('should process bank transfer payment', () => {
      const bankTransfer = new BankTransferPayment('123456789', 'Chase Bank');
      const processor = new PaymentProcessor(bankTransfer);

      const result = processor.processPayment(200);

      expect(result).toBe('Paid $200 via bank transfer from Chase Bank account 123456789');
    });

    it('should process crypto payment', () => {
      const crypto = new CryptoPayment('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'Bitcoin');
      const processor = new PaymentProcessor(crypto);

      const result = processor.processPayment(75);

      expect(result).toBe('Paid $75 using Bitcoin from wallet 1A1zP1...vfNa');
    });

    it('should allow changing payment strategy', () => {
      const creditCard = new CreditCardPayment('1111222233334444', 'Jane Smith');
      const paypal = new PayPalPayment('jane@example.com');
      const processor = new PaymentProcessor(creditCard);

      let result = processor.processPayment(100);
      expect(result).toContain('Credit Card');

      processor.setStrategy(paypal);
      result = processor.processPayment(100);
      expect(result).toContain('PayPal');
    });
  });

  describe('Sorting Strategies', () => {
    const testData = [64, 34, 25, 12, 22, 11, 90];
    const expectedSorted = [11, 12, 22, 25, 34, 64, 90];

    it('should sort using bubble sort strategy', () => {
      const bubbleSort = new BubbleSortStrategy();
      const context = new SortContext(bubbleSort);

      const result = context.sort(testData);

      expect(result).toEqual(expectedSorted);
      expect(testData).toEqual([64, 34, 25, 12, 22, 11, 90]); // Original unchanged
    });

    it('should sort using quick sort strategy', () => {
      const quickSort = new QuickSortStrategy();
      const context = new SortContext(quickSort);

      const result = context.sort(testData);

      expect(result).toEqual(expectedSorted);
    });

    it('should sort using merge sort strategy', () => {
      const mergeSort = new MergeSortStrategy();
      const context = new SortContext(mergeSort);

      const result = context.sort(testData);

      expect(result).toEqual(expectedSorted);
    });

    it('should allow changing sorting strategy', () => {
      const bubbleSort = new BubbleSortStrategy();
      const quickSort = new QuickSortStrategy();
      const context = new SortContext(bubbleSort);

      let result1 = context.sort(testData);
      expect(result1).toEqual(expectedSorted);

      context.setStrategy(quickSort);
      let result2 = context.sort(testData);
      expect(result2).toEqual(expectedSorted);
    });

    it('should handle empty array', () => {
      const bubbleSort = new BubbleSortStrategy();
      const context = new SortContext(bubbleSort);

      const result = context.sort([]);

      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const quickSort = new QuickSortStrategy();
      const context = new SortContext(quickSort);

      const result = context.sort([42]);

      expect(result).toEqual([42]);
    });
  });

  describe('Compression Strategies', () => {
    const testData = 'Hello, World! This is test data for compression.';

    it('should compress and decompress using ZIP strategy', () => {
      const zipStrategy = new ZipCompressionStrategy();
      const context = new CompressionContext(zipStrategy);

      const compressed = context.compress(testData);
      const decompressed = context.decompress(compressed);

      expect(compressed).toBe(`ZIP_COMPRESSED[${testData}]`);
      expect(decompressed).toBe(testData);
    });

    it('should compress and decompress using RAR strategy', () => {
      const rarStrategy = new RarCompressionStrategy();
      const context = new CompressionContext(rarStrategy);

      const compressed = context.compress(testData);
      const decompressed = context.decompress(compressed);

      expect(compressed).toBe(`RAR_COMPRESSED[${testData}]`);
      expect(decompressed).toBe(testData);
    });

    it('should allow changing compression strategy', () => {
      const zipStrategy = new ZipCompressionStrategy();
      const rarStrategy = new RarCompressionStrategy();
      const context = new CompressionContext(zipStrategy);

      let compressed = context.compress(testData);
      expect(compressed).toContain('ZIP_COMPRESSED');

      context.setStrategy(rarStrategy);
      compressed = context.compress(testData);
      expect(compressed).toContain('RAR_COMPRESSED');
    });

    it('should handle empty string', () => {
      const zipStrategy = new ZipCompressionStrategy();
      const context = new CompressionContext(zipStrategy);

      const compressed = context.compress('');
      const decompressed = context.decompress(compressed);

      expect(compressed).toBe('ZIP_COMPRESSED[]');
      expect(decompressed).toBe('');
    });
  });
});
