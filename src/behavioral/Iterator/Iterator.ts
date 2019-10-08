/**
 * Iterator Pattern
 * Provides a way to access the elements of an aggregate object sequentially
 * without exposing its underlying representation.
 */

// Iterator interface
export interface Iterator<T> {
  hasNext(): boolean;

  next(): T;

  current(): T;

  reset(): void;
}

// Aggregate interface
export interface Iterable<T> {
  createIterator(): Iterator<T>;
}

// Concrete Iterator
export class ArrayIterator<T> implements Iterator<T> {
  private collection: T[];
  private position: number = 0;

  constructor(collection: T[]) {
    this.collection = collection;
  }

  public hasNext(): boolean {
    return this.position < this.collection.length;
  }

  public next(): T {
    const item = this.collection[this.position];
    this.position++;
    return item;
  }

  public current(): T {
    return this.collection[this.position];
  }

  public reset(): void {
    this.position = 0;
  }
}

// Concrete Aggregate
export class Collection<T> implements Iterable<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public removeItem(item: T): void {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  public createIterator(): Iterator<T> {
    return new ArrayIterator<T>(this.items);
  }

  public getItems(): T[] {
    return [...this.items];
  }

  public getCount(): number {
    return this.items.length;
  }
}

// More complex example: Tree structure with iterator
export class TreeNode<T> {
  private value: T;
  private children: TreeNode<T>[] = [];

  constructor(value: T) {
    this.value = value;
  }

  public addChild(child: TreeNode<T>): void {
    this.children.push(child);
  }

  public removeChild(child: TreeNode<T>): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  public getValue(): T {
    return this.value;
  }

  public getChildren(): TreeNode<T>[] {
    return [...this.children];
  }
}

// Depth-First Iterator
export class DepthFirstIterator<T> implements Iterator<T> {
  private root: TreeNode<T>;
  private stack: TreeNode<T>[] = [];
  private currentNode: TreeNode<T> | null = null;

  constructor(root: TreeNode<T>) {
    this.root = root;
    this.reset();
  }

  public hasNext(): boolean {
    return this.stack.length > 0;
  }

  public next(): T {
    if (!this.hasNext()) {
      throw new Error('No more elements');
    }

    const node = this.stack.pop()!;
    this.currentNode = node;

    // Push children to stack in reverse order (so they're popped in correct order)
    const children = node.getChildren();
    for (let i = children.length - 1; i >= 0; i--) {
      this.stack.push(children[i]);
    }

    return node.getValue();
  }

  public current(): T {
    if (!this.currentNode) {
      throw new Error('Iterator not initialized');
    }
    return this.currentNode.getValue();
  }

  public reset(): void {
    this.stack = [];
    this.currentNode = null;
    this.stack.push(this.root);
  }
}

// Breadth-First Iterator
export class BreadthFirstIterator<T> implements Iterator<T> {
  private root: TreeNode<T>;
  private queue: TreeNode<T>[] = [];
  private currentNode: TreeNode<T> | null = null;

  constructor(root: TreeNode<T>) {
    this.root = root;
    this.reset();
  }

  public hasNext(): boolean {
    return this.queue.length > 0;
  }

  public next(): T {
    if (!this.hasNext()) {
      throw new Error('No more elements');
    }

    const node = this.queue.shift()!;
    this.currentNode = node;

    // Add all children to the queue
    node.getChildren().forEach(child => {
      this.queue.push(child);
    });

    return node.getValue();
  }

  public current(): T {
    if (!this.currentNode) {
      throw new Error('Iterator not initialized');
    }
    return this.currentNode.getValue();
  }

  public reset(): void {
    this.queue = [];
    this.currentNode = null;
    this.queue.push(this.root);
  }
}
