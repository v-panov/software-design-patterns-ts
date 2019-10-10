/**
 * Memento Pattern
 * Without violating encapsulation, captures and externalizes an object's internal state
 * so that the object can be restored to this state later.
 */

// Memento - stores the internal state of the Originator
export class Memento<T> {
  private state: T;
  private date: Date;

  constructor(state: T) {
    this.state = state;
    this.date = new Date();
  }

  public getState(): T {
    return JSON.parse(JSON.stringify(this.state));
  }

  public getDate(): Date {
    return this.date;
  }

  public getName(): string {
    return `${this.date.toISOString()} / ${JSON.stringify(this.state).substring(0, 20)}...`;
  }
}

// Originator - creates a memento containing a snapshot of its current state
export class Originator<T> {
  private state: T;

  constructor(state: T) {
    this.state = state;
  }

  public getState(): T {
    return this.deepCopy(this.state);
  }

  public setState(state: T): void {
    console.log(`State changing to: ${JSON.stringify(state)}`);
    this.state = this.deepCopy(state);
  }

  public save(): Memento<T> {
    console.log('Saving state...');
    return new Memento<T>(this.deepCopy(this.state));
  }

  public restore(memento: Memento<T>): void {
    this.state = this.deepCopy(memento.getState());
    console.log(`State restored to: ${JSON.stringify(this.state)}`);
  }

  private deepCopy(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

// Caretaker - keeps track of multiple mementos
export class Caretaker<T> {
  private mementos: Memento<T>[] = [];
  private originator: Originator<T>;

  constructor(originator: Originator<T>) {
    this.originator = originator;
  }

  public backup(): void {
    console.log('\nCaretaker: Saving Originator\'s state...');
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (!this.mementos.length) {
      console.log('Caretaker: No mementos to restore');
      return;
    }

    if (this.mementos.length === 1) {
      // If there's only one memento, restore to it (initial state)
      const initialMemento = this.mementos[0];
      console.log(`Caretaker: Restoring state to: ${initialMemento.getName()}`);
      try {
        this.originator.restore(initialMemento);
      } catch (e) {
        console.error('Caretaker: Failed to restore initial state:', e);
      }
      return;
    }

    // Store the current memento before removing it
    const currentMemento = this.mementos.pop();

    // Get the previous state in the array (which is now the last one)
    const previousMemento = this.mementos[this.mementos.length - 1];
    console.log(`Caretaker: Restoring state to: ${previousMemento.getName()}`);

    try {
      this.originator.restore(previousMemento);
    } catch (e) {
      // If restoration fails, put the current memento back to maintain consistency
      if (currentMemento) {
        this.mementos.push(currentMemento);
      }
      console.error('Caretaker: Failed to restore state:', e);
    }
  }

  public showHistory(): void {
    console.log('Caretaker: Here\'s the list of mementos:');
    for (const memento of this.mementos) {
      console.log(memento.getName());
    }
  }

  public getMementos(): Memento<T>[] {
    return [...this.mementos];
  }

  public restoreToIndex(index: number): void {
    if (index < 0 || index >= this.mementos.length) {
      throw new Error('Invalid memento index');
    }

    const memento = this.mementos[index];
    this.originator.restore(memento);
  }
}

// More practical example: Editor with undo functionality

// Text document class (Originator)
export interface DocumentState {
  content: string;
  cursorPosition: number;
  selectionLength: number;
  formatting: {
    isBold: boolean;
    isItalic: boolean;
    fontSize: number;
    fontFamily: string;
  };
}

export class TextDocument {
  private state: DocumentState;

  constructor(initialContent: string = '') {
    this.state = {
      content: initialContent,
      cursorPosition: 0,
      selectionLength: 0,
      formatting: {
        isBold: false,
        isItalic: false,
        fontSize: 12,
        fontFamily: 'Arial'
      }
    };
  }

  public getState(): DocumentState {
    return {...this.state};
  }

  public type(text: string): void {
    const currentContent = this.state.content;
    const cursorPosition = this.state.cursorPosition;

    // Insert text at cursor position
    this.state.content = [
      currentContent.slice(0, cursorPosition),
      text,
      currentContent.slice(cursorPosition + this.state.selectionLength)
    ].join('');

    // Update cursor position
    this.state.cursorPosition += text.length;
    this.state.selectionLength = 0;
  }

  public delete(): void {
    const currentContent = this.state.content;
    const cursorPosition = this.state.cursorPosition;
    const selectionLength = this.state.selectionLength;

    if (selectionLength > 0) {
      // Delete selected text
      this.state.content = [
        currentContent.slice(0, cursorPosition),
        currentContent.slice(cursorPosition + selectionLength)
      ].join('');
      this.state.selectionLength = 0;
    } else if (cursorPosition < currentContent.length) {
      // Delete character after the cursor
      this.state.content = [
        currentContent.slice(0, cursorPosition),
        currentContent.slice(cursorPosition + 1)
      ].join('');
    }
  }

  public moveCursor(position: number): void {
    if (position >= 0 && position <= this.state.content.length) {
      this.state.cursorPosition = position;
      this.state.selectionLength = 0;
    }
  }

  public select(start: number, length: number): void {
    if (start >= 0 && start + length <= this.state.content.length) {
      this.state.cursorPosition = start;
      this.state.selectionLength = length;
    }
  }

  public applyFormatting(formatting: Partial<DocumentState['formatting']>): void {
    this.state.formatting = {...this.state.formatting, ...formatting};
  }

  public createMemento(): Memento<DocumentState> {
    return new Memento<DocumentState>(JSON.parse(JSON.stringify(this.state)));
  }

  public restoreFromMemento(memento: Memento<DocumentState>): void {
    this.state = JSON.parse(JSON.stringify(memento.getState()));
  }

  public getContent(): string {
    return this.state.content;
  }
}

// Document history class (Caretaker)
export class DocumentHistory {
  private document: TextDocument;
  private mementos: Memento<DocumentState>[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number;

  constructor(document: TextDocument, maxHistorySize: number = 100) {
    this.document = document;
    this.maxHistorySize = maxHistorySize;
    this.saveState(); // Save the initial state
  }

  public saveState(): void {
    // Remove any forward history when making a new change
    if (this.currentIndex < this.mementos.length - 1) {
      this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    }

    // Add new memento
    this.mementos.push(this.document.createMemento());
    this.currentIndex = this.mementos.length - 1;

    // Limit history size
    if (this.mementos.length > this.maxHistorySize) {
      this.mementos.shift();
      this.currentIndex--;
    }
  }

  public undo(): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.document.restoreFromMemento(this.mementos[this.currentIndex]);
      return true;
    }
    return false;
  }

  public redo(): boolean {
    if (this.currentIndex < this.mementos.length - 1) {
      this.currentIndex++;
      this.document.restoreFromMemento(this.mementos[this.currentIndex]);
      return true;
    }
    return false;
  }

  public canUndo(): boolean {
    return this.currentIndex > 0;
  }

  public canRedo(): boolean {
    return this.currentIndex < this.mementos.length - 1;
  }

  public getHistorySize(): number {
    return this.mementos.length;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getHistoryStates(): { date: Date; preview: string }[] {
    return this.mementos.map(memento => {
      const content = memento.getState().content;
      const preview = content.length > 30
        ? content.substring(0, 30) + '...'
        : content;
      return {
        date: memento.getDate(),
        preview
      };
    });
  }
}

// Game Character State example

export interface CharacterState {
  name: string;
  level: number;
  health: number;
  mana: number;
  position: { x: number; y: number; z: number };
  inventory: Array<{ id: string; name: string; quantity: number }>;
  skills: Record<string, number>; // skill name -> level
}

export class GameCharacter {
  private state: CharacterState;

  constructor(name: string) {
    this.state = {
      name,
      level: 1,
      health: 100,
      mana: 50,
      position: {x: 0, y: 0, z: 0},
      inventory: [],
      skills: {}
    };
  }

  public getState(): CharacterState {
    return JSON.parse(JSON.stringify(this.state));
  }

  public takeDamage(amount: number): void {
    this.state.health = Math.max(0, this.state.health - amount);
    console.log(`${this.state.name} takes ${amount} damage. Health: ${this.state.health}`);
  }

  public heal(amount: number): void {
    this.state.health = Math.min(100, this.state.health + amount);
    console.log(`${this.state.name} heals for ${amount}. Health: ${this.state.health}`);
  }

  public useMana(amount: number): boolean {
    if (this.state.mana >= amount) {
      this.state.mana -= amount;
      console.log(`${this.state.name} uses ${amount} mana. Remaining: ${this.state.mana}`);
      return true;
    }
    console.log(`${this.state.name} doesn't have enough mana!`);
    return false;
  }

  public move(x: number, y: number, z: number): void {
    this.state.position = {x, y, z};
    console.log(`${this.state.name} moves to position (${x}, ${y}, ${z})`);
  }

  public addItem(id: string, name: string, quantity: number = 1): void {
    const existingItem = this.state.inventory.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.state.inventory.push({id, name, quantity});
    }

    console.log(`${this.state.name} acquired ${quantity} ${name}`);
  }

  public removeItem(id: string, quantity: number = 1): boolean {
    const itemIndex = this.state.inventory.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      console.log(`${this.state.name} doesn't have that item!`);
      return false;
    }

    const item = this.state.inventory[itemIndex];

    if (item.quantity <= quantity) {
      this.state.inventory.splice(itemIndex, 1);
    } else {
      item.quantity -= quantity;
    }

    console.log(`${this.state.name} used ${quantity} ${item.name}`);
    return true;
  }

  public gainExperience(amount: number): void {
    console.log(`${this.state.name} gains ${amount} experience!`);
    // Simple leveling system: every 100 experience points = 1 level
    const experiencePerLevel = 100;
    const levelsGained = Math.floor(amount / experiencePerLevel);

    if (levelsGained > 0) {
      this.state.level += levelsGained;
      console.log(`${this.state.name} levels up to ${this.state.level}!`);
    } else {
      console.log(`${this.state.name} needs more experience to level up.`);
    }
  }

  public learnSkill(skillName: string, level: number = 1): void {
    this.state.skills[skillName] = level;
    console.log(`${this.state.name} learned ${skillName} (Level ${level})`);
  }

  public improveSkill(skillName: string): boolean {
    if (this.state.skills[skillName]) {
      this.state.skills[skillName] += 1;
      console.log(`${this.state.name}'s ${skillName} improved to Level ${this.state.skills[skillName]}!`);
      return true;
    }
    console.log(`${this.state.name} doesn't know ${skillName} skill!`);
    return false;
  }

  public createMemento(): Memento<CharacterState> {
    return new Memento<CharacterState>(this.getState());
  }

  public restoreFromMemento(memento: Memento<CharacterState>): void {
    this.state = JSON.parse(JSON.stringify(memento.getState()));
    console.log(`${this.state.name}'s state has been restored!`);
  }
}

// Game Checkpoint Manager (Caretaker)
export class GameCheckpointManager {
  private checkpoints: Map<string, Memento<CharacterState>> = new Map();
  private autoSaves: Memento<CharacterState>[] = [];
  private character: GameCharacter;
  private maxAutoSaves: number;

  constructor(character: GameCharacter, maxAutoSaves: number = 5) {
    this.character = character;
    this.maxAutoSaves = maxAutoSaves;
  }

  public createCheckpoint(name: string): void {
    this.checkpoints.set(name, this.character.createMemento());
    console.log(`Checkpoint created: ${name}`);
  }

  public restoreCheckpoint(name: string): boolean {
    const checkpoint = this.checkpoints.get(name);

    if (checkpoint) {
      this.character.restoreFromMemento(checkpoint);
      console.log(`Restored checkpoint: ${name}`);
      return true;
    }

    console.log(`Checkpoint not found: ${name}`);
    return false;
  }

  public autoSave(): void {
    this.autoSaves.push(this.character.createMemento());

    if (this.autoSaves.length > this.maxAutoSaves) {
      this.autoSaves.shift(); // Remove oldest autosave
    }

    console.log('Game auto-saved');
  }

  public loadLastAutoSave(): boolean {
    if (this.autoSaves.length === 0) {
      console.log('No auto-saves available');
      return false;
    }

    const lastAutoSave = this.autoSaves[this.autoSaves.length - 1];
    this.character.restoreFromMemento(lastAutoSave);
    console.log('Loaded last auto-save');
    return true;
  }

  public getCheckpointList(): string[] {
    return Array.from(this.checkpoints.keys());
  }

  public getAutoSaveCount(): number {
    return this.autoSaves.length;
  }

  public deleteCheckpoint(name: string): boolean {
    return this.checkpoints.delete(name);
  }

  public clearAllCheckpoints(): void {
    this.checkpoints.clear();
    console.log('All checkpoints cleared');
  }
}
