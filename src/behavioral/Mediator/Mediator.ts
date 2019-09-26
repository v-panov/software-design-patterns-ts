/**
 * Mediator Pattern
 * Defines an object that encapsulates how a set of objects interact.
 * Promotes loose coupling by keeping objects from referring to each other explicitly.
 */

// Mediator Interface
export interface ChatMediator {
  sendMessage(message: string, sender: ChatUser): void;

  addUser(user: ChatUser): void;

  removeUser(user: ChatUser): void;
}

// Abstract Colleague
export abstract class ChatUser {
  protected mediator: ChatMediator;
  protected name: string;
  protected messages: string[] = [];

  constructor(mediator: ChatMediator, name: string) {
    this.mediator = mediator;
    this.name = name;
    this.mediator.addUser(this);
  }

  abstract send(message: string): void;

  abstract receive(message: string, sender: ChatUser): void;

  public getName(): string {
    return this.name;
  }

  public getMessages(): string[] {
    return [...this.messages]; // Return a copy of messages
  }

  public disconnect(): void {
    this.mediator.removeUser(this);
  }
}

// Concrete Mediator
export class ChatRoom implements ChatMediator {
  private users: ChatUser[] = [];
  private messageLog: string[] = [];

  public sendMessage(message: string, sender: ChatUser): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${sender.getName()}: ${message}`;

    // Log the message
    this.messageLog.push(formattedMessage);

    // Distribute the message to all users except the sender
    this.users.forEach(user => {
      if (user !== sender) {
        user.receive(message, sender);
      }
    });
  }

  public addUser(user: ChatUser): void {
    const userIndex = this.users.indexOf(user);
    if (userIndex === -1) {
      this.users.push(user);
      this.messageLog.push(`[SYSTEM] ${user.getName()} has joined the chat.`);
    }
  }

  public removeUser(user: ChatUser): void {
    const userIndex = this.users.indexOf(user);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      this.messageLog.push(`[SYSTEM] ${user.getName()} has left the chat.`);
    }
  }

  public getMessageLog(): string[] {
    return [...this.messageLog]; // Return a copy of the log
  }

  public getUserCount(): number {
    return this.users.length;
  }
}

// Concrete Colleagues
export class RegularUser extends ChatUser {
  constructor(mediator: ChatMediator, name: string) {
    super(mediator, name);
  }

  public send(message: string): void {
    console.log(`${this.name} sends: ${message}`);
    this.mediator.sendMessage(message, this);
  }

  public receive(message: string, sender: ChatUser): void {
    const formattedMessage = `${sender.getName()}: ${message}`;
    console.log(`${this.name} received: ${formattedMessage}`);
    this.messages.push(formattedMessage);
  }
}

export class PremiumUser extends ChatUser {
  private isAway: boolean = false;
  private awayMessage: string = "I'm currently away.";

  constructor(mediator: ChatMediator, name: string) {
    super(mediator, name);
  }

  public send(message: string): void {
    if (this.isAway) {
      console.log(`${this.name} cannot send messages while away.`);
      return;
    }
    console.log(`${this.name} (Premium) sends: ${message}`);
    this.mediator.sendMessage(message, this);
  }

  public receive(message: string, sender: ChatUser): void {
    const formattedMessage = `${sender.getName()}: ${message}`;
    console.log(`${this.name} (Premium) received: ${formattedMessage}`);
    this.messages.push(formattedMessage);

    // Auto-reply if away
    if (this.isAway) {
      this.mediator.sendMessage(this.awayMessage, this);
    }
  }

  public setAwayStatus(isAway: boolean, customMessage?: string): void {
    this.isAway = isAway;
    if (customMessage) {
      this.awayMessage = customMessage;
    }
  }

  public getAwayStatus(): boolean {
    return this.isAway;
  }
}

export class AdminUser extends ChatUser {
  constructor(mediator: ChatMediator, name: string) {
    super(mediator, name);
  }

  public send(message: string): void {
    console.log(`${this.name} (Admin) sends: ${message}`);
    this.mediator.sendMessage(message, this);
  }

  public receive(message: string, sender: ChatUser): void {
    const formattedMessage = `${sender.getName()}: ${message}`;
    console.log(`${this.name} (Admin) received: ${formattedMessage}`);
    this.messages.push(formattedMessage);
  }

  // Admin-specific functionality
  public broadcastAnnouncement(announcement: string): void {
    const adminMessage = `ANNOUNCEMENT: ${announcement}`;
    console.log(`${this.name} broadcasts: ${adminMessage}`);
    this.mediator.sendMessage(adminMessage, this);
  }

  public viewAllMessages(chatRoom: ChatRoom): string[] {
    return chatRoom.getMessageLog();
  }
}
