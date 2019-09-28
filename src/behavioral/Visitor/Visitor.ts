/**
 * Visitor Pattern
 * Represents an operation to be performed on the elements of an object structure.
 * Visitor lets you define a new operation without changing the classes of the elements on which it operates.
 */

// Visitor interface
export interface Visitor {
  visitConcreteElementA(element: ConcreteElementA): void;

  visitConcreteElementB(element: ConcreteElementB): void;
}

// Element interface
export interface Element {
  accept(visitor: Visitor): void;
}

// Concrete Elements
export class ConcreteElementA implements Element {
  private data: string;

  constructor(data: string) {
    this.data = data;
  }

  public accept(visitor: Visitor): void {
    visitor.visitConcreteElementA(this);
  }

  public operationA(): string {
    return `Element A operation with data: ${this.data}`;
  }

  public getData(): string {
    return this.data;
  }
}

export class ConcreteElementB implements Element {
  private count: number;

  constructor(count: number) {
    this.count = count;
  }

  public accept(visitor: Visitor): void {
    visitor.visitConcreteElementB(this);
  }

  public operationB(): string {
    return `Element B operation with count: ${this.count}`;
  }

  public getCount(): number {
    return this.count;
  }
}

// Concrete Visitors
export class ConcreteVisitor1 implements Visitor {
  private results: string[] = [];

  public visitConcreteElementA(element: ConcreteElementA): void {
    this.results.push(`Visitor 1: ${element.operationA()}`);
  }

  public visitConcreteElementB(element: ConcreteElementB): void {
    this.results.push(`Visitor 1: ${element.operationB()}`);
  }

  public getResults(): string[] {
    return [...this.results];
  }
}

export class ConcreteVisitor2 implements Visitor {
  private results: string[] = [];

  public visitConcreteElementA(element: ConcreteElementA): void {
    this.results.push(`Visitor 2: ${element.getData()} transformed`);
  }

  public visitConcreteElementB(element: ConcreteElementB): void {
    this.results.push(`Visitor 2: ${element.getCount() * 2} calculated`);
  }

  public getResults(): string[] {
    return [...this.results];
  }
}

// Object Structure that holds a collection of elements
export class ObjectStructure {
  private elements: Element[] = [];

  public add(element: Element): void {
    this.elements.push(element);
  }

  public remove(element: Element): void {
    const index = this.elements.indexOf(element);
    if (index !== -1) {
      this.elements.splice(index, 1);
    }
  }

  public accept(visitor: Visitor): void {
    this.elements.forEach(element => {
      element.accept(visitor);
    });
  }
}

// More practical example: File System Visitors

// File System Element interface
export interface FileSystemElement {
  accept(visitor: FileSystemVisitor): void;

  getName(): string;

  getPath(): string;
}

// File System Visitor interface
export interface FileSystemVisitor {
  visitFile(file: File): void;

  visitDirectory(directory: Directory): void;
}

// File class
export class File implements FileSystemElement {
  private name: string;
  private path: string;
  private size: number;
  private content: string;
  private extension: string;
  private createdAt: Date;

  constructor(name: string, path: string, size: number, content: string) {
    this.name = name;
    this.path = path;
    this.size = size;
    this.content = content;
    this.extension = name.substring(name.lastIndexOf('.') + 1);
    this.createdAt = new Date();
  }

  public accept(visitor: FileSystemVisitor): void {
    visitor.visitFile(this);
  }

  public getName(): string {
    return this.name;
  }

  public getPath(): string {
    return this.path;
  }

  public getSize(): number {
    return this.size;
  }

  public getContent(): string {
    return this.content;
  }

  public getExtension(): string {
    return this.extension;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}

// Directory class
export class Directory implements FileSystemElement {
  private name: string;
  private path: string;
  private children: FileSystemElement[] = [];
  private createdAt: Date;

  constructor(name: string, path: string) {
    this.name = name;
    this.path = path;
    this.createdAt = new Date();
  }

  public accept(visitor: FileSystemVisitor): void {
    visitor.visitDirectory(this);

    // Visit children recursively
    this.children.forEach(child => {
      child.accept(visitor);
    });
  }

  public add(element: FileSystemElement): void {
    this.children.push(element);
  }

  public remove(element: FileSystemElement): void {
    const index = this.children.indexOf(element);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  public getName(): string {
    return this.name;
  }

  public getPath(): string {
    return this.path;
  }

  public getChildren(): FileSystemElement[] {
    return [...this.children];
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}

// File Statistics Visitor
export class FileStatisticsVisitor implements FileSystemVisitor {
  private fileCount: number = 0;
  private directoryCount: number = 0;
  private totalSize: number = 0;
  private extensionCounts: Record<string, number> = {};

  public visitFile(file: File): void {
    this.fileCount++;
    this.totalSize += file.getSize();

    const extension = file.getExtension();
    this.extensionCounts[extension] = (this.extensionCounts[extension] || 0) + 1;
  }

  public visitDirectory(directory: Directory): void {
    this.directoryCount++;
  }

  public getFileCount(): number {
    return this.fileCount;
  }

  public getDirectoryCount(): number {
    return this.directoryCount;
  }

  public getTotalSize(): number {
    return this.totalSize;
  }

  public getExtensionCounts(): Record<string, number> {
    return {...this.extensionCounts};
  }

  public getStatistics(): string {
    return `File System Statistics:
      Files: ${this.fileCount}
      Directories: ${this.directoryCount}
      Total Size: ${this.totalSize} bytes
      Extensions: ${JSON.stringify(this.extensionCounts)}`;
  }
}

// Search Visitor
export class SearchVisitor implements FileSystemVisitor {
  private searchTerm: string;
  private foundItems: FileSystemElement[] = [];

  constructor(searchTerm: string) {
    this.searchTerm = searchTerm.toLowerCase();
  }

  public visitFile(file: File): void {
    // Search in file name
    if (file.getName().toLowerCase().includes(this.searchTerm)) {
      this.foundItems.push(file);
      return;
    }

    // Search in file content
    if (file.getContent().toLowerCase().includes(this.searchTerm)) {
      this.foundItems.push(file);
    }
  }

  public visitDirectory(directory: Directory): void {
    // Search in directory name
    if (directory.getName().toLowerCase().includes(this.searchTerm)) {
      this.foundItems.push(directory);
    }
  }

  public getFoundItems(): FileSystemElement[] {
    return [...this.foundItems];
  }

  public getResults(): string {
    return `Search Results for "${this.searchTerm}":
      Found ${this.foundItems.length} items
      ${this.foundItems.map(item => item.getPath()).join('\n      ')}`;
  }
}

// Backup Visitor
export class BackupVisitor implements FileSystemVisitor {
  private backupLog: string[] = [];

  public visitFile(file: File): void {
    // Simulate backing up a file
    this.backupLog.push(`Backed up file: ${file.getPath()} (${file.getSize()} bytes)`);
  }

  public visitDirectory(directory: Directory): void {
    // Simulate creating a backup directory
    this.backupLog.push(`Created backup directory: ${directory.getPath()}`);
  }

  public getBackupLog(): string[] {
    return [...this.backupLog];
  }

  public getReport(): string {
    return `Backup Report:\n${this.backupLog.join('\n')}`;
  }
}
