/**
 * Strategy Pattern
 * Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
 */

// Strategy interface
export interface PaymentStrategy {
  pay(amount: number): string;
}

// Concrete Strategies
export class CreditCardPayment implements PaymentStrategy {
  private cardNumber: string;
  private name: string;

  constructor(cardNumber: string, name: string) {
    this.cardNumber = cardNumber;
    this.name = name;
  }

  pay(amount: number): string {
    return `Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)} (${this.name})`;
  }
}

export class PayPalPayment implements PaymentStrategy {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  pay(amount: number): string {
    return `Paid $${amount} using PayPal account ${this.email}`;
  }
}

export class BankTransferPayment implements PaymentStrategy {
  private accountNumber: string;
  private bankName: string;

  constructor(accountNumber: string, bankName: string) {
    this.accountNumber = accountNumber;
    this.bankName = bankName;
  }

  pay(amount: number): string {
    return `Paid $${amount} via bank transfer from ${this.bankName} account ${this.accountNumber}`;
  }
}

export class CryptoPayment implements PaymentStrategy {
  private walletAddress: string;
  private currency: string;

  constructor(walletAddress: string, currency: string) {
    this.walletAddress = walletAddress;
    this.currency = currency;
  }

  pay(amount: number): string {
    return `Paid $${amount} using ${this.currency} from wallet ${this.walletAddress.slice(0, 6)}...${this.walletAddress.slice(-4)}`;
  }
}

// Context
export class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  processPayment(amount: number): string {
    return this.strategy.pay(amount);
  }
}

// Alternative example: Sorting strategies
export interface SortStrategy<T> {
  sort(data: T[]): T[];
}

export class BubbleSortStrategy implements SortStrategy<number> {
  sort(data: number[]): number[] {
    const arr = [...data];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }

    return arr;
  }
}

export class QuickSortStrategy implements SortStrategy<number> {
  sort(data: number[]): number[] {
    const arr = [...data];
    return this.quickSort(arr, 0, arr.length - 1);
  }

  private quickSort(arr: number[], low: number, high: number): number[] {
    if (low < high) {
      const pi = this.partition(arr, low, high);
      this.quickSort(arr, low, pi - 1);
      this.quickSort(arr, pi + 1, high);
    }
    return arr;
  }

  private partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }
}

export class MergeSortStrategy implements SortStrategy<number> {
  sort(data: number[]): number[] {
    const arr = [...data];
    return this.mergeSort(arr);
  }

  private mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid));
    const right = this.mergeSort(arr.slice(mid));

    return this.merge(left, right);
  }

  private merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }
}

export class SortContext {
  private strategy: SortStrategy<number>;

  constructor(strategy: SortStrategy<number>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SortStrategy<number>): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

// Compression strategies example
export interface CompressionStrategy {
  compress(data: string): string;

  decompress(data: string): string;
}

export class ZipCompressionStrategy implements CompressionStrategy {
  compress(data: string): string {
    return `ZIP_COMPRESSED[${data}]`;
  }

  decompress(data: string): string {
    return data.replace(/^ZIP_COMPRESSED\[(.*)\]$/, '$1');
  }
}

export class RarCompressionStrategy implements CompressionStrategy {
  compress(data: string): string {
    return `RAR_COMPRESSED[${data}]`;
  }

  decompress(data: string): string {
    return data.replace(/^RAR_COMPRESSED\[(.*)\]$/, '$1');
  }
}

export class CompressionContext {
  private strategy: CompressionStrategy;

  constructor(strategy: CompressionStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: CompressionStrategy): void {
    this.strategy = strategy;
  }

  compress(data: string): string {
    return this.strategy.compress(data);
  }

  decompress(data: string): string {
    return this.strategy.decompress(data);
  }
}
