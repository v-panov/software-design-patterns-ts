import {
  Originator,
  Caretaker,
  TextDocument,
  DocumentHistory,
  GameCharacter,
  GameCheckpointManager
} from './Memento';

describe('Memento Pattern', () => {
  describe('Basic Memento Implementation', () => {
    interface TestState {
      field1: string;
      field2: number;
      field3: boolean;
    }

    let originator: Originator<TestState>;
    let caretaker: Caretaker<TestState>;

    beforeEach(() => {
      const initialState: TestState = {field1: 'initial', field2: 10, field3: false};
      originator = new Originator<TestState>(initialState);
      caretaker = new Caretaker<TestState>(originator);
    });

    it('should save and restore state', () => {
      // Save the initial state
      caretaker.backup();

      // Change state
      originator.setState({field1: 'changed', field2: 20, field3: true});
      expect(originator.getState()).toEqual({field1: 'changed', field2: 20, field3: true});

      // Restore to the initial state
      caretaker.undo();
      expect(originator.getState()).toEqual({field1: 'initial', field2: 10, field3: false});
    });

    it('should maintain multiple backups', () => {
      // Create the first backup
      caretaker.backup();

      // Change state and create a second backup
      originator.setState({field1: 'state2', field2: 20, field3: false});
      caretaker.backup();

      // Change state and create a third backup
      originator.setState({field1: 'state3', field2: 30, field3: true});
      caretaker.backup();

      // Verify we have 3 mementos
      expect(caretaker.getMementos().length).toBe(3);

      // Restore one step back
      caretaker.undo();
      expect(originator.getState()).toEqual({field1: 'state2', field2: 20, field3: false});

      // Restore one more step back
      caretaker.undo();
      expect(originator.getState()).toEqual({field1: 'initial', field2: 10, field3: false});
    });

    it('should handle direct memento creation and restoration', () => {
      // Save state directly with originator
      const memento = originator.save();

      // Change state
      originator.setState({field1: 'direct change', field2: 50, field3: true});
      expect(originator.getState()).toEqual({field1: 'direct change', field2: 50, field3: true});

      // Restore directly with the originator
      originator.restore(memento);
      expect(originator.getState()).toEqual({field1: 'initial', field2: 10, field3: false});
    });

    it('should create independent copies of state', () => {
      // Save state
      caretaker.backup();

      // Get the original state
      const originalState = originator.getState();

      // Modify the original state
      originalState.field1 = 'modified';
      originalState.field2 = 99;

      // Restore from backup
      caretaker.undo();

      // State should be unchanged by our modifications to the original object
      expect(originator.getState()).toEqual({field1: 'initial', field2: 10, field3: false});
    });

    it('should handle restoring to specific index', () => {
      // Create multiple backups with different states
      caretaker.backup(); // state1
      originator.setState({field1: 'state2', field2: 20, field3: false});
      caretaker.backup(); // state2
      originator.setState({field1: 'state3', field2: 30, field3: true});
      caretaker.backup(); // state3
      originator.setState({field1: 'state4', field2: 40, field3: false});
      caretaker.backup(); // state4

      // Restore to index 1 (state2)
      caretaker.restoreToIndex(1);
      expect(originator.getState()).toEqual({field1: 'state2', field2: 20, field3: false});
    });
  });

  describe('Text Document with Undo/Redo', () => {
    let document: TextDocument;
    let history: DocumentHistory;

    beforeEach(() => {
      document = new TextDocument();
      history = new DocumentHistory(document);
    });

    it('should allow typing and undoing', () => {
      document.type('Hello');
      history.saveState();
      expect(document.getContent()).toBe('Hello');

      document.type(' World');
      history.saveState();
      expect(document.getContent()).toBe('Hello World');

      // Undo should revert to 'Hello'
      history.undo();
      expect(document.getContent()).toBe('Hello');

      // Redo should go back to 'Hello World'
      history.redo();
      expect(document.getContent()).toBe('Hello World');
    });

    it('should handle cursor movement and selection', () => {
      document.type('Hello World');
      history.saveState();

      // Move the cursor and select 'World'
      document.select(6, 5);
      history.saveState();

      // Replace 'World' with 'Universe'
      document.type('Universe');
      history.saveState();
      expect(document.getContent()).toBe('Hello Universe');

      // Undo typing 'Universe'
      history.undo();
      expect(document.getContent()).toBe('Hello World');

      // Undo selection
      history.undo();
      // Content is the same, but the selection state is different
      expect(document.getContent()).toBe('Hello World');

      // Undo typing 'Hello World'
      history.undo();
      expect(document.getContent()).toBe('');
    });

    it('should handle deleting text', () => {
      document.type('Hello World');
      history.saveState();

      // Select 'World'
      document.select(6, 5);
      document.delete();
      history.saveState();
      expect(document.getContent()).toBe('Hello ');

      // Type 'TypeScript'
      document.type('TypeScript');
      history.saveState();
      expect(document.getContent()).toBe('Hello TypeScript');

      // Undo typing 'TypeScript'
      history.undo();
      expect(document.getContent()).toBe('Hello ');

      // Undo deleting 'World'
      history.undo();
      expect(document.getContent()).toBe('Hello World');
    });

    it('should handle formatting changes', () => {
      document.type('Hello');
      history.saveState();

      document.applyFormatting({isBold: true});
      history.saveState();

      document.applyFormatting({isItalic: true, fontSize: 14});
      history.saveState();

      // Get current state
      const state = document.getState();
      expect(state.formatting.isBold).toBe(true);
      expect(state.formatting.isItalic).toBe(true);
      expect(state.formatting.fontSize).toBe(14);

      // Undo last formatting
      history.undo();
      const undoState = document.getState();
      expect(undoState.formatting.isBold).toBe(true);
      expect(undoState.formatting.isItalic).toBe(false);
      expect(undoState.formatting.fontSize).toBe(12);

      // Undo bold formatting
      history.undo();
      const undoState2 = document.getState();
      expect(undoState2.formatting.isBold).toBe(false);
    });

    it('should have functioning canUndo and canRedo methods', () => {
      // Initially can't undo or redo
      expect(history.canUndo()).toBe(false);
      expect(history.canRedo()).toBe(false);

      // After a change, can undo but not redo
      document.type('Hello');
      history.saveState();
      expect(history.canUndo()).toBe(true);
      expect(history.canRedo()).toBe(false);

      // After undo, can't undo again but can redo
      history.undo();
      expect(history.canUndo()).toBe(false);
      expect(history.canRedo()).toBe(true);

      // After redo, can undo again but not redo
      history.redo();
      expect(history.canUndo()).toBe(true);
      expect(history.canRedo()).toBe(false);
    });

    it('should discard forward history when making new changes after undo', () => {
      document.type('Step 1');
      history.saveState();
      document.type(' - Step 2');
      history.saveState();
      document.type(' - Step 3');
      history.saveState();

      // Undo twice to get back to 'Step 1'
      history.undo();
      history.undo();
      expect(document.getContent()).toBe('Step 1');

      // Make a new change
      document.type(' - New direction');
      history.saveState();
      expect(document.getContent()).toBe('Step 1 - New direction');

      // Shouldn't be able to redo to 'Step 2' or 'Step 3' anymore
      expect(history.canRedo()).toBe(false);

      // Undo should go back to 'Step 1'
      history.undo();
      expect(document.getContent()).toBe('Step 1');
    });
  });

  describe('Game Character State Management', () => {
    let character: GameCharacter;
    let checkpointManager: GameCheckpointManager;

    beforeEach(() => {
      character = new GameCharacter('Hero');
      checkpointManager = new GameCheckpointManager(character);
    });

    it('should save and restore character state with checkpoints', () => {
      // Initial state
      expect(character.getState().health).toBe(100);
      expect(character.getState().level).toBe(1);

      // Create a checkpoint
      checkpointManager.createCheckpoint('StartingPoint');

      // Change character state
      character.takeDamage(30);
      character.move(10, 20, 5);
      character.addItem('sword1', 'Iron Sword');
      character.learnSkill('Slash');

      // Verify changes
      expect(character.getState().health).toBe(70);
      expect(character.getState().position).toEqual({x: 10, y: 20, z: 5});
      expect(character.getState().inventory).toHaveLength(1);
      expect(character.getState().inventory[0].name).toBe('Iron Sword');
      expect(character.getState().skills.Slash).toBe(1);

      // Restore to the starting point
      checkpointManager.restoreCheckpoint('StartingPoint');

      // Verify state was restored
      expect(character.getState().health).toBe(100);
      expect(character.getState().position).toEqual({x: 0, y: 0, z: 0});
      expect(character.getState().inventory).toHaveLength(0);
      expect(character.getState().skills).toEqual({});
    });

    it('should handle multiple checkpoints', () => {
      // Create checkpoint at start
      checkpointManager.createCheckpoint('Beginning');

      // Change the state and create another checkpoint
      character.gainExperience(100);
      character.learnSkill('Fireball');
      checkpointManager.createCheckpoint('AfterFireball');

      // Change state more
      character.addItem('potion', 'Health Potion', 3);
      character.takeDamage(20);
      checkpointManager.createCheckpoint('Wounded');

      // Verify checkpoint list
      const checkpoints = checkpointManager.getCheckpointList();
      expect(checkpoints).toContain('Beginning');
      expect(checkpoints).toContain('AfterFireball');
      expect(checkpoints).toContain('Wounded');

      // Restore to after learning fireball
      checkpointManager.restoreCheckpoint('AfterFireball');
      expect(character.getState().level).toBe(2); // From gainExperience
      expect(character.getState().skills.Fireball).toBe(1);
      expect(character.getState().health).toBe(100); // Not wounded yet
      expect(character.getState().inventory).toHaveLength(0); // No potions yet
    });

    it('should handle auto-saves', () => {
      // Make changes and create auto-saves
      character.move(5, 5, 0);
      checkpointManager.autoSave();

      character.takeDamage(10);
      checkpointManager.autoSave();

      character.addItem('gem', 'Ruby');
      checkpointManager.autoSave();

      // Verify the auto-save count
      expect(checkpointManager.getAutoSaveCount()).toBe(3);

      // Make more changes
      character.takeDamage(90); // Character dies
      expect(character.getState().health).toBe(0);
      expect(character.getState().inventory[0].name).toBe('Ruby');

      // Load last auto-save
      checkpointManager.loadLastAutoSave();

      // Verify state was restored to last auto-save
      expect(character.getState().health).toBe(90); // Health should be 100-10=90
      expect(character.getState().inventory[0].name).toBe('Ruby'); // Still has the ruby
    });

    it('should limit auto-saves to maximum number', () => {
      // Create a manager with max 3 auto-saves
      const limitedManager = new GameCheckpointManager(character, 3);

      // Create 5 auto-saves
      for (let i = 0; i < 5; i++) {
        character.move(i * 10, 0, 0); // Move to different positions
        limitedManager.autoSave();
      }

      // Should only have 3 auto-saves
      expect(limitedManager.getAutoSaveCount()).toBe(3);

      // Load last auto-save - should be at position (40, 0, 0)
      limitedManager.loadLastAutoSave();
      expect(character.getState().position.x).toBe(40); // Last position
    });

    it('should handle checkpoint deletion', () => {
      // Create checkpoints
      checkpointManager.createCheckpoint('First');
      checkpointManager.createCheckpoint('Second');

      // Delete a checkpoint
      expect(checkpointManager.deleteCheckpoint('First')).toBe(true);

      // Verify it's gone
      expect(checkpointManager.getCheckpointList()).not.toContain('First');
      expect(checkpointManager.getCheckpointList()).toContain('Second');

      // Try to restore a deleted checkpoint
      expect(checkpointManager.restoreCheckpoint('First')).toBe(false);

      // Clear all checkpoints
      checkpointManager.clearAllCheckpoints();
      expect(checkpointManager.getCheckpointList()).toHaveLength(0);
    });
  });
});
