import {
  Collection,
  TreeNode,
  DepthFirstIterator,
  BreadthFirstIterator
} from './Iterator';

describe('Iterator Pattern', () => {
  describe('Simple Collection Iterator', () => {
    let collection: Collection<string>;

    beforeEach(() => {
      collection = new Collection<string>();
      collection.addItem('First');
      collection.addItem('Second');
      collection.addItem('Third');
      collection.addItem('Fourth');
    });

    it('should iterate through all elements', () => {
      const iterator = collection.createIterator();
      const results: string[] = [];

      while (iterator.hasNext()) {
        results.push(iterator.next());
      }

      expect(results).toEqual(['First', 'Second', 'Third', 'Fourth']);
    });

    it('should return the current element', () => {
      const iterator = collection.createIterator();

      // Move to the second element
      iterator.next();
      iterator.next();

      expect(iterator.current()).toBe('Third');
    });

    it('should reset the iterator', () => {
      const iterator = collection.createIterator();

      // Move through some elements
      iterator.next();
      iterator.next();

      // Reset and start over
      iterator.reset();
      const results: string[] = [];

      while (iterator.hasNext()) {
        results.push(iterator.next());
      }

      expect(results).toEqual(['First', 'Second', 'Third', 'Fourth']);
    });

    it('should handle adding and removing items', () => {
      collection.addItem('Fifth');

      const iterator = collection.createIterator();
      const results: string[] = [];

      while (iterator.hasNext()) {
        results.push(iterator.next());
      }

      expect(results).toEqual(['First', 'Second', 'Third', 'Fourth', 'Fifth']);

      // Remove an item
      collection.removeItem('Third');

      // Get a new iterator
      const iterator2 = collection.createIterator();
      const results2: string[] = [];

      while (iterator2.hasNext()) {
        results2.push(iterator2.next());
      }

      expect(results2).toEqual(['First', 'Second', 'Fourth', 'Fifth']);
    });
  });

  describe('Tree Iterators', () => {
    let root: TreeNode<string>;
    let child1: TreeNode<string>;
    let child2: TreeNode<string>;
    let child1_1: TreeNode<string>;
    let child1_2: TreeNode<string>;
    let child2_1: TreeNode<string>;

    /*
     * Tree structure:
     *       root
     *      /    \
     *  child1   child2
     *   / \       |
     * 1_1 1_2    2_1
     */
    beforeEach(() => {
      root = new TreeNode<string>('root');
      child1 = new TreeNode<string>('child1');
      child2 = new TreeNode<string>('child2');
      child1_1 = new TreeNode<string>('child1_1');
      child1_2 = new TreeNode<string>('child1_2');
      child2_1 = new TreeNode<string>('child2_1');

      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(child1_1);
      child1.addChild(child1_2);
      child2.addChild(child2_1);
    });

    it('should traverse depth-first', () => {
      const iterator = new DepthFirstIterator<string>(root);
      const results: string[] = [];

      while (iterator.hasNext()) {
        results.push(iterator.next());
      }

      // Depth-first should go down each branch completely before moving to the next
      expect(results).toEqual(['root', 'child1', 'child1_1', 'child1_2', 'child2', 'child2_1']);
    });

    it('should traverse breadth-first', () => {
      const iterator = new BreadthFirstIterator<string>(root);
      const results: string[] = [];

      while (iterator.hasNext()) {
        results.push(iterator.next());
      }

      // Breadth-first should go level by level
      expect(results).toEqual(['root', 'child1', 'child2', 'child1_1', 'child1_2', 'child2_1']);
    });

    it('should reset depth-first iterator', () => {
      const iterator = new DepthFirstIterator<string>(root);

      // Move through some elements
      iterator.next();
      iterator.next();
      iterator.next();

      // Reset and start over
      iterator.reset();
      const results: string[] = [];

      while (iterator.hasNext()) {
        results.push(iterator.next());
      }

      expect(results).toEqual(['root', 'child1', 'child1_1', 'child1_2', 'child2', 'child2_1']);
    });

    it('should reset breadth-first iterator', () => {
      const iterator = new BreadthFirstIterator<string>(root);

      // Move through some elements
      iterator.next();
      iterator.next();
      iterator.next();

      // Reset and start over
      iterator.reset();
      const results: string[] = [];

      while (iterator.hasNext()) {
        results.push(iterator.next());
      }

      expect(results).toEqual(['root', 'child1', 'child2', 'child1_1', 'child1_2', 'child2_1']);
    });

    it('should handle removing nodes from the tree', () => {
      // Remove a node
      child1.removeChild(child1_2);

      const iterator = new DepthFirstIterator<string>(root);
      const results: string[] = [];

      while (iterator.hasNext()) {
        results.push(iterator.next());
      }

      expect(results).toEqual(['root', 'child1', 'child1_1', 'child2', 'child2_1']);
    });

    it('should throw error when accessing current without initialization', () => {
      const iterator = new DepthFirstIterator<string>(root);

      // First call next to initialize current
      iterator.next();
      expect(iterator.current()).toBe('root');

      // Reset to clear current
      iterator.reset();

      // Should throw when trying to access current
      expect(() => {
        iterator.current();
      }).toThrow('Iterator not initialized');
    });

    it('should throw error when no more elements', () => {
      const iterator = new DepthFirstIterator<string>(root);

      // Consume all elements
      while (iterator.hasNext()) {
        iterator.next();
      }

      // Should throw when trying to get next with no more elements
      expect(() => {
        iterator.next();
      }).toThrow('No more elements');
    });
  });
});
