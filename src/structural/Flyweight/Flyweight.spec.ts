import {
  TreeTypeFactory,
  Tree,
  Forest,
  Canvas,
  StyleManager,
  TextEditor
} from './Flyweight';

describe('Flyweight Pattern', () => {
  beforeEach(() => {
    // Reset static factories before each test
    TreeTypeFactory.reset();
    StyleManager.reset();
  });

  describe('Tree Flyweight Example', () => {
    it('should reuse tree types when possible', () => {
      const forest = new Forest();
      const canvas = new Canvas(800, 600);

      // Plant 1000 trees with only 3 tree types
      for (let i = 0; i < 1000; i++) {
        forest.plantTree(
          Math.floor(Math.random() * 800),
          Math.floor(Math.random() * 600),
          Math.floor(Math.random() * 10) + 20,
          Math.floor(Math.random() * 5) + 5,
          ['Oak', 'Pine', 'Maple'][i % 3],
          ['Green', 'Dark Green', 'Light Green'][i % 3],
          ['Rough', 'Smooth', 'Scaly'][i % 3]
        );
      }

      // Verify we have 1000 trees but only 3 tree types
      expect(forest.getTreeCount()).toBe(1000);
      expect(forest.getTreeTypeCount()).toBe(3);
    });

    it('should create different tree types for different properties', () => {
      const treeType1 = TreeTypeFactory.getTreeType('Oak', 'Green', 'Rough');
      const treeType2 = TreeTypeFactory.getTreeType('Oak', 'Green', 'Rough');
      const treeType3 = TreeTypeFactory.getTreeType('Pine', 'Green', 'Rough');

      // Verify same tree types are reused
      expect(treeType1).toBe(treeType2);
      expect(treeType1).not.toBe(treeType3);
      expect(TreeTypeFactory.getCount()).toBe(2);
    });

    it('should render trees with correct extrinsic state', () => {
      const canvas = new Canvas(800, 600);
      const treeType = TreeTypeFactory.getTreeType('Oak', 'Green', 'Rough');
      const tree = new Tree(100, 200, 30, 10, treeType);

      const result = tree.draw(canvas);
      expect(result).toContain('Oak tree');
      expect(result).toContain('Green color');
      expect(result).toContain('at (100, 200)');
      expect(result).toContain('height=30');
      expect(result).toContain('width=10');
    });
  });

  describe('Text Editor Flyweight Example', () => {
    it('should reuse character styles', () => {
      const editor = new TextEditor();

      // Add text with the same style
      editor.addText('Hello', 'Arial', 12, true, false, 'black');
      editor.addText(' World', 'Arial', 12, true, false, 'black');

      // Add text with different style
      editor.addText('!', 'Arial', 14, true, true, 'red');

      // Should have 12 characters but only 2 styles
      expect(editor.getCharacterCount()).toBe(12);
      expect(editor.getStyleCount()).toBe(2);
    });

    it('should render characters with correct styles', () => {
      const editor = new TextEditor();

      editor.addText('A', 'Arial', 12, true, false, 'black');
      editor.addText('B', 'Times', 14, false, true, 'red');

      const rendered = editor.render();
      expect(rendered[0]).toContain("Character 'A'");
      expect(rendered[0]).toContain('Arial');
      expect(rendered[0]).toContain('Bold');
      expect(rendered[0]).toContain('Not Italic');
      expect(rendered[0]).toContain('black');

      expect(rendered[1]).toContain("Character 'B'");
      expect(rendered[1]).toContain('Times');
      expect(rendered[1]).toContain('Not Bold');
      expect(rendered[1]).toContain('Italic');
      expect(rendered[1]).toContain('red');
    });

    it('should properly handle large text with few styles', () => {
      const editor = new TextEditor();
      const longText = 'This is a very long text that uses only two styles but has many characters.';

      // First half with one style
      editor.addText(
        longText.substring(0, longText.length / 2),
        'Arial', 12, false, false, 'black'
      );

      // Second half with another style
      editor.addText(
        longText.substring(longText.length / 2),
        'Arial', 12, true, false, 'black'
      );

      expect(editor.getCharacterCount()).toBe(longText.length);
      expect(editor.getStyleCount()).toBe(2);
    });
  });

  describe('Style Manager', () => {
    it('should create styles only once', () => {
      const style1 = StyleManager.getStyle('Arial', 12, true, false, 'black');
      const style2 = StyleManager.getStyle('Arial', 12, true, false, 'black');
      const style3 = StyleManager.getStyle('Arial', 12, false, false, 'black');

      expect(style1).toBe(style2); // Same style reference
      expect(style1).not.toBe(style3); // Different style reference
      expect(StyleManager.getStyleCount()).toBe(2);
    });
  });
});
