/**
 * State Pattern
 * Allows an object to alter its behavior when its internal state changes.
 * The object will appear to change its class.
 */

// State interface
export interface State {
  handle(context: Context): void;

  getName(): string;
}

// Context class
export class Context {
  private state: State;
  private log: string[] = [];

  constructor(initialState: State) {
    this.state = initialState;
    this.log.push(`Context initialized with ${initialState.getName()} state`);
  }

  public setState(state: State): void {
    this.log.push(`State changed from ${this.state.getName()} to ${state.getName()}`);
    this.state = state;
  }

  public getState(): State {
    return this.state;
  }

  public request(): void {
    this.log.push(`Request handled by ${this.state.getName()} state`);
    this.state.handle(this);
  }

  public getLog(): string[] {
    return [...this.log];
  }

  public clearLog(): void {
    this.log = [];
  }
}

// Concrete States
export class ConcreteStateA implements State {
  public handle(context: Context): void {
    // State A behavior
    // Transition to State B
    context.setState(new ConcreteStateB());
  }

  public getName(): string {
    return 'State A';
  }
}

export class ConcreteStateB implements State {
  public handle(context: Context): void {
    // State B behavior
    // Transition to State C
    context.setState(new ConcreteStateC());
  }

  public getName(): string {
    return 'State B';
  }
}

export class ConcreteStateC implements State {
  public handle(context: Context): void {
    // State C behavior
    // Transition back to State A
    context.setState(new ConcreteStateA());
  }

  public getName(): string {
    return 'State C';
  }
}

// More practical example: Document Approval System

// Document states
export enum DocumentStatus {
  DRAFT = 'Draft',
  MODERATION = 'Moderation',
  PUBLISHED = 'Published',
  REJECTED = 'Rejected',
  ARCHIVED = 'Archived'
}

// Document state interface
export interface DocumentState {
  draft(document: Document): void;

  moderate(document: Document): void;

  publish(document: Document): void;

  reject(document: Document): void;

  archive(document: Document): void;

  getStatus(): DocumentStatus;
}

// Document class
export class Document {
  private state: DocumentState;
  private content: string = '';
  private history: string[] = [];

  constructor() {
    this.state = new DraftState();
    this.addToHistory(`Document created in ${this.state.getStatus()} state`);
  }

  public setState(state: DocumentState): void {
    this.addToHistory(`Status changed from ${this.state.getStatus()} to ${state.getStatus()}`);
    this.state = state;
  }

  public getState(): DocumentState {
    return this.state;
  }

  public getStatus(): DocumentStatus {
    return this.state.getStatus();
  }

  public draft(): void {
    this.addToHistory('Draft action requested');
    this.state.draft(this);
  }

  public moderate(): void {
    this.addToHistory('Moderation action requested');
    this.state.moderate(this);
  }

  public publish(): void {
    this.addToHistory('Publish action requested');
    this.state.publish(this);
  }

  public reject(): void {
    this.addToHistory('Reject action requested');
    this.state.reject(this);
  }

  public archive(): void {
    this.addToHistory('Archive action requested');
    this.state.archive(this);
  }

  public setContent(content: string): void {
    this.content = content;
    this.addToHistory('Content updated');
  }

  public getContent(): string {
    return this.content;
  }

  public getHistory(): string[] {
    return [...this.history];
  }

  private addToHistory(entry: string): void {
    this.history.push(`${new Date().toISOString()} - ${entry}`);
  }
}

// Concrete Document States
export class DraftState implements DocumentState {
  public draft(document: Document): void {
    // Already in draft state
  }

  public moderate(document: Document): void {
    document.setState(new ModerationState());
  }

  public publish(document: Document): void {
    // Cannot publish directly from draft, must go through moderation
    throw new Error('Cannot publish directly from Draft state');
  }

  public reject(document: Document): void {
    // Cannot reject a draft
    throw new Error('Cannot reject a Draft state document');
  }

  public archive(document: Document): void {
    document.setState(new ArchivedState());
  }

  public getStatus(): DocumentStatus {
    return DocumentStatus.DRAFT;
  }
}

export class ModerationState implements DocumentState {
  public draft(document: Document): void {
    document.setState(new DraftState());
  }

  public moderate(document: Document): void {
    // Already in moderation state
  }

  public publish(document: Document): void {
    document.setState(new PublishedState());
  }

  public reject(document: Document): void {
    document.setState(new RejectedState());
  }

  public archive(document: Document): void {
    document.setState(new ArchivedState());
  }

  public getStatus(): DocumentStatus {
    return DocumentStatus.MODERATION;
  }
}

export class PublishedState implements DocumentState {
  public draft(document: Document): void {
    document.setState(new DraftState());
  }

  public moderate(document: Document): void {
    document.setState(new ModerationState());
  }

  public publish(document: Document): void {
    // Already published
  }

  public reject(document: Document): void {
    // Cannot reject an already published document
    throw new Error('Cannot reject a Published state document');
  }

  public archive(document: Document): void {
    document.setState(new ArchivedState());
  }

  public getStatus(): DocumentStatus {
    return DocumentStatus.PUBLISHED;
  }
}

export class RejectedState implements DocumentState {
  public draft(document: Document): void {
    document.setState(new DraftState());
  }

  public moderate(document: Document): void {
    // Rejected documents cannot go back to moderation directly
    throw new Error('Rejected document must be drafted first');
  }

  public publish(document: Document): void {
    // Cannot publish a rejected document
    throw new Error('Cannot publish a Rejected state document');
  }

  public reject(document: Document): void {
    // Already rejected
  }

  public archive(document: Document): void {
    document.setState(new ArchivedState());
  }

  public getStatus(): DocumentStatus {
    return DocumentStatus.REJECTED;
  }
}

export class ArchivedState implements DocumentState {
  public draft(document: Document): void {
    document.setState(new DraftState());
  }

  public moderate(document: Document): void {
    // Cannot moderate an archived document
    throw new Error('Cannot moderate an Archived state document');
  }

  public publish(document: Document): void {
    // Cannot publish an archived document
    throw new Error('Cannot publish an Archived state document');
  }

  public reject(document: Document): void {
    // Cannot reject an archived document
    throw new Error('Cannot reject an Archived state document');
  }

  public archive(document: Document): void {
    // Already archived
  }

  public getStatus(): DocumentStatus {
    return DocumentStatus.ARCHIVED;
  }
}
