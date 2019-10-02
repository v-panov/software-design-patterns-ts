/**
 * Chain of Responsibility Pattern
 * Avoids coupling the sender of a request to its receiver by giving more than one object a chance to handle the request.
 * Chains the receiving objects and passes the request along the chain until an object handles it.
 */

// The Handler interface declares the method for building the chain
// and the method for handling requests
export interface Handler {
  setNext(handler: Handler): Handler;

  handle(request: string): string | null;
}

// The base Handler class provides the default implementation for the setNext method
export abstract class AbstractHandler implements Handler {
  private nextHandler: Handler | null = null;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // Return a handler from here to allow chaining
    return handler;
  }

  public handle(request: string): string | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

// Concrete Handlers implement specific handling behavior
export class ConcreteHandlerA extends AbstractHandler {
  public handle(request: string): string | null {
    // Check if this handler can process the request
    if (request === 'A') {
      return `Handler A: I'll handle the ${request} request.`;
    }
    // Otherwise, pass it to the next handler in the chain
    return super.handle(request);
  }
}

export class ConcreteHandlerB extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === 'B') {
      return `Handler B: I'll handle the ${request} request.`;
    }
    return super.handle(request);
  }
}

export class ConcreteHandlerC extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === 'C') {
      return `Handler C: I'll handle the ${request} request.`;
    }
    return super.handle(request);
  }
}

// More practical example: Request Processing Pipeline

// Request interface
export interface Request {
  type: string;
  content: string;
  metadata?: Record<string, any>;
}

// Response interface
export interface Response {
  success: boolean;
  message: string;
  data?: any;
  handled?: boolean;
}

// RequestHandler interface
export interface RequestHandler {
  setNext(handler: RequestHandler): RequestHandler;

  process(request: Request): Response;
}

// Base RequestHandler implementation
export abstract class BaseRequestHandler implements RequestHandler {
  private nextHandler: RequestHandler | null = null;

  public setNext(handler: RequestHandler): RequestHandler {
    this.nextHandler = handler;
    return handler;
  }

  public process(request: Request): Response {
    // If this handler can't process, pass to the next one
    if (this.nextHandler) {
      return this.nextHandler.process(request);
    }

    // End of a chain reached without handling
    return {
      success: false,
      message: 'Request could not be processed by any handler',
      handled: false
    };
  }
}

// Authentication Handler
export class AuthenticationHandler extends BaseRequestHandler {
  private validTokens: string[] = ['valid-token-1', 'valid-token-2'];

  public process(request: Request): Response {
    console.log('AuthenticationHandler: Processing request...');

    // Check if authentication data exists in metadata
    if (!request.metadata || !request.metadata.token) {
      return {
        success: false,
        message: 'Authentication failed: No token provided',
        handled: true
      };
    }

    // Validate the token
    if (!this.validTokens.includes(request.metadata.token)) {
      return {
        success: false,
        message: 'Authentication failed: Invalid token',
        handled: true
      };
    }

    // Authentication successful, pass to next handler
    return super.process(request);
  }
}

// Validation Handler
export class ValidationHandler extends BaseRequestHandler {
  public process(request: Request): Response {
    console.log('ValidationHandler: Processing request...');

    // Validate the request has required fields
    if (!request.type) {
      return {
        success: false,
        message: 'Validation failed: Request type is required',
        handled: true
      };
    }

    if (!request.content || request.content.trim() === '') {
      return {
        success: false,
        message: 'Validation failed: Content cannot be empty',
        handled: true
      };
    }

    // Validation successful, pass to next handler
    return super.process(request);
  }
}

// Request Type Handlers
export class DataRequestHandler extends BaseRequestHandler {
  public process(request: Request): Response {
    console.log('DataRequestHandler: Processing request...');

    if (request.type === 'data') {
      // Process data request
      return {
        success: true,
        message: 'Data request processed successfully',
        data: {
          id: '123',
          result: `Processed: ${request.content}`
        },
        handled: true
      };
    }

    // Not a data request, pass to the next handler
    return super.process(request);
  }
}

export class CommandRequestHandler extends BaseRequestHandler {
  public process(request: Request): Response {
    console.log('CommandRequestHandler: Processing request...');

    if (request.type === 'command') {
      // Execute the command
      return {
        success: true,
        message: 'Command executed successfully',
        data: {
          commandResult: `Executed command: ${request.content}`
        },
        handled: true
      };
    }

    // Not a command request, pass to the next handler
    return super.process(request);
  }
}

export class LoggingHandler extends BaseRequestHandler {
  private logs: string[] = [];

  public process(request: Request): Response {
    // Log the request
    const logEntry = `${new Date().toISOString()} - Processing ${request.type} request: ${request.content}`;
    this.logs.push(logEntry);
    console.log('LoggingHandler:', logEntry);

    // This handler doesn't handle the request, just logs it and passes along
    return super.process(request);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}
