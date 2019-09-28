import {
  ConcreteElementA,
  ConcreteElementB,
  ConcreteVisitor1,
  ConcreteVisitor2,
  ObjectStructure,
  File,
  Directory,
  FileStatisticsVisitor,
  SearchVisitor,
  BackupVisitor
} from './Visitor';

describe('Visitor Pattern', () => {
  describe('Basic Visitor Implementation', () => {
    let objectStructure: ObjectStructure;
    let elementA1: ConcreteElementA;
    let elementA2: ConcreteElementA;
    let elementB: ConcreteElementB;

    beforeEach(() => {
      objectStructure = new ObjectStructure();
      elementA1 = new ConcreteElementA('Data A1');
      elementA2 = new ConcreteElementA('Data A2');
      elementB = new ConcreteElementB(42);

      objectStructure.add(elementA1);
      objectStructure.add(elementA2);
      objectStructure.add(elementB);
    });

    it('should allow visitor 1 to visit all elements', () => {
      const visitor = new ConcreteVisitor1();
      objectStructure.accept(visitor);

      const results = visitor.getResults();
      expect(results).toHaveLength(3);
      expect(results[0]).toContain('Visitor 1: Element A operation with data: Data A1');
      expect(results[1]).toContain('Visitor 1: Element A operation with data: Data A2');
      expect(results[2]).toContain('Visitor 1: Element B operation with count: 42');
    });

    it('should allow visitor 2 to visit all elements with different behavior', () => {
      const visitor = new ConcreteVisitor2();
      objectStructure.accept(visitor);

      const results = visitor.getResults();
      expect(results).toHaveLength(3);
      expect(results[0]).toContain('Visitor 2: Data A1 transformed');
      expect(results[1]).toContain('Visitor 2: Data A2 transformed');
      expect(results[2]).toContain('Visitor 2: 84 calculated'); // 42 * 2
    });

    it('should handle removal of elements', () => {
      objectStructure.remove(elementA1);

      const visitor = new ConcreteVisitor1();
      objectStructure.accept(visitor);

      const results = visitor.getResults();
      expect(results).toHaveLength(2);
      expect(results[0]).toContain('Data A2'); // First element should be A2 now
    });

    it('should allow elements to accept visitors directly', () => {
      const visitor = new ConcreteVisitor1();
      elementB.accept(visitor);

      const results = visitor.getResults();
      expect(results).toHaveLength(1);
      expect(results[0]).toContain('Element B operation with count: 42');
    });
  });

  describe('File System Visitors', () => {
    let rootDir: Directory;
    let docsDir: Directory;
    let sourceDir: Directory;
    let readmeFile: File;
    let configFile: File;
    let appFile: File;
    let utilFile: File;

    beforeEach(() => {
      // Create a file system structure
      rootDir = new Directory('root', '/root');
      docsDir = new Directory('docs', '/root/docs');
      sourceDir = new Directory('src', '/root/src');

      readmeFile = new File('README.md', '/root/README.md', 1024, '# Project Documentation\nThis is a sample project.');
      configFile = new File('config.json', '/root/config.json', 256, '{"version": "1.0.0"}');
      appFile = new File('app.ts', '/root/src/app.ts', 2048, 'console.log("Hello, World!");');
      utilFile = new File('utils.ts', '/root/src/utils.ts', 1536, 'export function formatDate(date) { return date.toISOString(); }');

      // Build the structure
      rootDir.add(docsDir);
      rootDir.add(sourceDir);
      rootDir.add(readmeFile);
      rootDir.add(configFile);

      sourceDir.add(appFile);
      sourceDir.add(utilFile);

      docsDir.add(new File('api.md', '/root/docs/api.md', 768, '## API Documentation'));
    });

    it('should collect file statistics', () => {
      const visitor = new FileStatisticsVisitor();
      rootDir.accept(visitor);

      expect(visitor.getFileCount()).toBe(5); // README.md, config.json, app.ts, utils.ts, api.md
      expect(visitor.getDirectoryCount()).toBe(3); // root, docs, src
      expect(visitor.getTotalSize()).toBe(5632); // Sum of all file sizes

      const extensionCounts = visitor.getExtensionCounts();
      expect(extensionCounts.md).toBe(2); // README.md, api.md
      expect(extensionCounts.json).toBe(1); // config.json
      expect(extensionCounts.ts).toBe(2); // app.ts, utils.ts
    });

    it('should find items by search term in name', () => {
      const visitor = new SearchVisitor('.ts');
      rootDir.accept(visitor);

      const foundItems = visitor.getFoundItems();
      expect(foundItems).toHaveLength(2);
      expect(foundItems[0].getName()).toBe('app.ts');
      expect(foundItems[1].getName()).toBe('utils.ts');
    });

    it('should find items by search term in content', () => {
      const visitor = new SearchVisitor('documentation');
      rootDir.accept(visitor);

      const foundItems = visitor.getFoundItems();
      expect(foundItems).toHaveLength(2); // README.md and api.md contain 'documentation'
    });

    it('should create a backup log', () => {
      const visitor = new BackupVisitor();
      rootDir.accept(visitor);

      const log = visitor.getBackupLog();
      expect(log).toHaveLength(8); // 3 directories + 5 files

      // Check that all directories are included
      expect(log.find(entry => entry.includes('/root'))).toBeDefined();
      expect(log.find(entry => entry.includes('/root/docs'))).toBeDefined();
      expect(log.find(entry => entry.includes('/root/src'))).toBeDefined();

      // Check that all files are included with their sizes
      expect(log.find(entry => entry.includes('/root/README.md') && entry.includes('1024'))).toBeDefined();
      expect(log.find(entry => entry.includes('/root/config.json') && entry.includes('256'))).toBeDefined();
      expect(log.find(entry => entry.includes('/root/src/app.ts') && entry.includes('2048'))).toBeDefined();
      expect(log.find(entry => entry.includes('/root/src/utils.ts') && entry.includes('1536'))).toBeDefined();
      expect(log.find(entry => entry.includes('/root/docs/api.md') && entry.includes('768'))).toBeDefined();
    });

    it('should allow multiple visitors to operate on the same structure', () => {
      // Use both statistics and search visitors
      const statsVisitor = new FileStatisticsVisitor();
      const searchVisitor = new SearchVisitor('export');

      rootDir.accept(statsVisitor);
      rootDir.accept(searchVisitor);

      // Statistics should be complete
      expect(statsVisitor.getFileCount()).toBe(5);

      // Search should find utils.ts which contains 'export'
      const foundItems = searchVisitor.getFoundItems();
      expect(foundItems).toHaveLength(1);
      expect(foundItems[0].getName()).toBe('utils.ts');
    });

    it('should handle updates to the file system structure', () => {
      // Add a new file
      const newFile = new File('newfile.txt', '/root/newfile.txt', 512, 'New content');
      rootDir.add(newFile);

      const visitor = new FileStatisticsVisitor();
      rootDir.accept(visitor);

      expect(visitor.getFileCount()).toBe(6); // Now includes the new file
      expect(visitor.getTotalSize()).toBe(6144); // 5632 + 512

      // Remove a directory
      rootDir.remove(docsDir);

      const visitor2 = new FileStatisticsVisitor();
      rootDir.accept(visitor2);

      expect(visitor2.getDirectoryCount()).toBe(2); // root, src (docs removed)
      expect(visitor2.getFileCount()).toBe(5); // One less file (api.md in docs)
    });
  });
});
