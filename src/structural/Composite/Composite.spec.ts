import {
  File,
  Directory,
  Circle,
  Rectangle,
  CompositeGraphic
} from './Composite';

describe('Composite Pattern', () => {
  describe('File System Example', () => {
    it('should calculate size correctly for files', () => {
      const file = new File('document.txt', 1024, 'Some content');
      expect(file.getSize()).toBe(1024);
    });

    it('should handle file content', () => {
      const file = new File('notes.txt', 0);
      file.setContent('This is the content');

      expect(file.getContent()).toBe('This is the content');
      expect(file.getSize()).toBe('This is the content'.length);
    });

    it('should calculate size correctly for directories', () => {
      const directory = new Directory('docs');
      directory.addComponent(new File('file1.txt', 100));
      directory.addComponent(new File('file2.txt', 200));

      expect(directory.getSize()).toBe(300);
    });

    it('should handle nested directories', () => {
      const rootDir = new Directory('root');
      const subDir1 = new Directory('subdir1', rootDir.getPath());
      const subDir2 = new Directory('subdir2', rootDir.getPath());

      rootDir.addComponent(subDir1);
      rootDir.addComponent(subDir2);

      subDir1.addComponent(new File('file1.txt', 100, '', subDir1.getPath()));
      subDir2.addComponent(new File('file2.txt', 200, '', subDir2.getPath()));
      subDir2.addComponent(new File('file3.txt', 300, '', subDir2.getPath()));

      expect(rootDir.getSize()).toBe(600);
      expect(subDir1.getSize()).toBe(100);
      expect(subDir2.getSize()).toBe(500);
    });

    it('should retrieve components by name', () => {
      const directory = new Directory('docs');
      const file1 = new File('report.txt', 150);
      const file2 = new File('data.csv', 250);

      directory.addComponent(file1);
      directory.addComponent(file2);

      expect(directory.getChild('report.txt')).toBe(file1);
      expect(directory.getChild('data.csv')).toBe(file2);
      expect(directory.getChild('nonexistent.txt')).toBeNull();
    });

    it('should remove components', () => {
      const directory = new Directory('docs');
      const file = new File('temp.txt', 100);

      directory.addComponent(file);
      expect(directory.getComponentCount()).toBe(1);

      directory.removeComponent(file);
      expect(directory.getComponentCount()).toBe(0);
    });

    it('should print file system structure', () => {
      const rootDir = new Directory('root');
      const docsDir = new Directory('docs', rootDir.getPath());

      rootDir.addComponent(docsDir);
      docsDir.addComponent(new File('report.txt', 150, '', docsDir.getPath()));

      const output = rootDir.print();

      expect(output).toContain('Directory: root');
      expect(output).toContain('Directory: docs');
      expect(output).toContain('File: report.txt');
    });

    it('should search for components by keyword', () => {
      const rootDir = new Directory('root');
      const docsDir = new Directory('documents', rootDir.getPath());
      const imageDir = new Directory('images', rootDir.getPath());

      rootDir.addComponent(docsDir);
      rootDir.addComponent(imageDir);

      docsDir.addComponent(new File('report.doc', 150, 'Annual report', docsDir.getPath()));
      docsDir.addComponent(new File('memo.txt', 50, 'Meeting memo', docsDir.getPath()));
      imageDir.addComponent(new File('logo.png', 200, '', imageDir.getPath()));

      // Search by filename
      const reportResults = rootDir.search('report');
      expect(reportResults.length).toBe(1);
      expect(reportResults[0].getName()).toBe('report.doc');

      // Search by content
      const memoResults = rootDir.search('memo');
      expect(memoResults.length).toBe(1);
      expect(memoResults[0].getName()).toBe('memo.txt');

      // Search by directory name
      const imageResults = rootDir.search('image');
      expect(imageResults.length).toBe(1);
      expect(imageResults[0].getName()).toBe('images');
    });
  });

  describe('Graphics Example', () => {
    it('should handle individual shapes', () => {
      const circle = new Circle(10, 20, 5);
      const rectangle = new Rectangle(30, 40, 15, 25);

      expect(circle.draw()).toContain('Circle at (10, 20)');
      expect(rectangle.draw()).toContain('Rectangle at (30, 40)');
    });

    it('should move shapes', () => {
      const circle = new Circle(10, 20, 5);
      circle.move(15, 25);

      const position = circle.getPosition();
      expect(position.x).toBe(15);
      expect(position.y).toBe(25);
    });

    it('should calculate bounds correctly', () => {
      const circle = new Circle(10, 10, 5);
      const bounds = circle.getBounds();

      expect(bounds.x).toBe(5); // 10 - 5
      expect(bounds.y).toBe(5); // 10 - 5
      expect(bounds.width).toBe(10); // 5 * 2
      expect(bounds.height).toBe(10); // 5 * 2
    });

    it('should compose multiple graphics', () => {
      const composite = new CompositeGraphic(0, 0);
      composite.add(new Circle(10, 10, 5));
      composite.add(new Rectangle(20, 20, 10, 10));

      expect(composite.getGraphicCount()).toBe(2);

      const output = composite.draw();
      expect(output).toContain('Composite at (0, 0) with 2 elements');
      expect(output).toContain('Circle at (10, 10)');
      expect(output).toContain('Rectangle at (20, 20)');
    });

    it('should move the composite and all its children', () => {
      const composite = new CompositeGraphic(0, 0);
      const circle = new Circle(10, 10, 5);
      const rectangle = new Rectangle(20, 20, 10, 10);

      composite.add(circle);
      composite.add(rectangle);

      // Move the entire group
      composite.move(5, 5);

      // Composite position should update
      expect(composite.getPosition().x).toBe(5);
      expect(composite.getPosition().y).toBe(5);

      // Child positions should update relative to their original positions
      expect(circle.getPosition().x).toBe(15); // 10 + 5
      expect(circle.getPosition().y).toBe(15); // 10 + 5
      expect(rectangle.getPosition().x).toBe(25); // 20 + 5
      expect(rectangle.getPosition().y).toBe(25); // 20 + 5
    });

    it('should calculate composite bounds correctly', () => {
      const composite = new CompositeGraphic();
      composite.add(new Circle(10, 10, 5));
      composite.add(new Rectangle(20, 20, 10, 10));

      const bounds = composite.getBounds();

      // Circle bounds: (5,5) to (15,15)
      // Rectangle bounds: (20,20) to (30,30)
      // Combined bounds should be (5,5) to (30,30)
      expect(bounds.x).toBe(5);
      expect(bounds.y).toBe(5);
      expect(bounds.width).toBe(25); // 30 - 5
      expect(bounds.height).toBe(25); // 30 - 5
    });

    it('should remove graphics from composite', () => {
      const composite = new CompositeGraphic();
      const circle = new Circle(10, 10, 5);
      const rectangle = new Rectangle(20, 20, 10, 10);

      composite.add(circle);
      composite.add(rectangle);
      expect(composite.getGraphicCount()).toBe(2);

      composite.remove(circle);
      expect(composite.getGraphicCount()).toBe(1);

      const remainingGraphics = composite.getGraphics();
      expect(remainingGraphics[0]).toBe(rectangle);
    });

    it('should handle nested composites', () => {
      const mainComposite = new CompositeGraphic(0, 0);
      const subComposite = new CompositeGraphic(10, 10);

      subComposite.add(new Circle(15, 15, 5));
      subComposite.add(new Rectangle(20, 20, 10, 10));

      mainComposite.add(subComposite);
      mainComposite.add(new Circle(50, 50, 10));

      // Move the main composite
      mainComposite.move(5, 5);

      // Check that sub-composite moved
      expect(subComposite.getPosition().x).toBe(15); // 10 + 5
      expect(subComposite.getPosition().y).toBe(15); // 10 + 5

      // Check that shapes in sub-composite moved
      const subGraphics = subComposite.getGraphics();
      const circle = subGraphics[0] as Circle;
      expect(circle.getPosition().x).toBe(20); // 15 + 5
      expect(circle.getPosition().y).toBe(20); // 15 + 5
    });
  });
});
