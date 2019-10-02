import {
  ConcreteHandlerA,
  ConcreteHandlerB,
  ConcreteHandlerC,
  AuthenticationHandler,
  ValidationHandler,
  DataRequestHandler,
  CommandRequestHandler,
  LoggingHandler,
  Request
} from './ChainOfResponsibility';

describe('Chain of Responsibility Pattern', () => {
  describe('Basic Chain of Responsibility', () => {
    let handlerA: ConcreteHandlerA;
    let handlerB: ConcreteHandlerB;
    let handlerC: ConcreteHandlerC;

    beforeEach(() => {
      handlerA = new ConcreteHandlerA();
      handlerB = new ConcreteHandlerB();
      handlerC = new ConcreteHandlerC();

      // Set up the chain
      handlerA.setNext(handlerB).setNext(handlerC);
    });

    it('should handle request A with Handler A', () => {
      const result = handlerA.handle('A');
      expect(result).toBe('Handler A: I\'ll handle the A request.');
    });

    it('should handle request B with Handler B', () => {
      const result = handlerA.handle('B');
      expect(result).toBe('Handler B: I\'ll handle the B request.');
    });

    it('should handle request C with Handler C', () => {
      const result = handlerA.handle('C');
      expect(result).toBe('Handler C: I\'ll handle the C request.');
    });

    it('should return null for unhandled requests', () => {
      const result = handlerA.handle('D');
      expect(result).toBeNull();
    });

    it('should work with a partial chain', () => {
      // Create a chain with only handlerA and handlerB
      const partialChain = new ConcreteHandlerA();
      partialChain.setNext(new ConcreteHandlerB());

      // Should handle A and B
      expect(partialChain.handle('A')).toBe('Handler A: I\'ll handle the A request.');
      expect(partialChain.handle('B')).toBe('Handler B: I\'ll handle the B request.');

      // But not C
      expect(partialChain.handle('C')).toBeNull();
    });
  });

  describe('Request Processing Pipeline', () => {
    let loggingHandler: LoggingHandler;
    let authHandler: AuthenticationHandler;
    let validationHandler: ValidationHandler;
    let dataHandler: DataRequestHandler;
    let commandHandler: CommandRequestHandler;

    beforeEach(() => {
      // Create handlers
      loggingHandler = new LoggingHandler();
      authHandler = new AuthenticationHandler();
      validationHandler = new ValidationHandler();
      dataHandler = new DataRequestHandler();
      commandHandler = new CommandRequestHandler();

      // Set up the chain
      loggingHandler
        .setNext(authHandler)
        .setNext(validationHandler)
        .setNext(dataHandler)
        .setNext(commandHandler);

      // Clear logs for each test
      loggingHandler.clearLogs();
    });

    it('should process a valid data request', () => {
      const request: Request = {
        type: 'data',
        content: 'Sample data',
        metadata: {token: 'valid-token-1'}
      };

      const response = loggingHandler.process(request);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Data request processed successfully');
      expect(response.handled).toBe(true);
      expect(response.data?.result).toBe('Processed: Sample data');

      // Check logging
      const logs = loggingHandler.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0]).toContain('Processing data request: Sample data');
    });

    it('should process a valid command request', () => {
      const request: Request = {
        type: 'command',
        content: 'runScript.js',
        metadata: {token: 'valid-token-2'}
      };

      const response = loggingHandler.process(request);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Command executed successfully');
      expect(response.handled).toBe(true);
      expect(response.data?.commandResult).toBe('Executed command: runScript.js');
    });

    it('should fail due to missing authentication token', () => {
      const request: Request = {
        type: 'data',
        content: 'Sample data'
        // No metadata with token
      };

      const response = loggingHandler.process(request);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Authentication failed: No token provided');
      expect(response.handled).toBe(true);
    });

    it('should fail due to invalid authentication token', () => {
      const request: Request = {
        type: 'data',
        content: 'Sample data',
        metadata: {token: 'invalid-token'}
      };

      const response = loggingHandler.process(request);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Authentication failed: Invalid token');
      expect(response.handled).toBe(true);
    });

    it('should fail validation due to missing content', () => {
      const request: Request = {
        type: 'data',
        content: '',  // Empty content
        metadata: {token: 'valid-token-1'}
      };

      const response = loggingHandler.process(request);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Validation failed: Content cannot be empty');
      expect(response.handled).toBe(true);
    });

    it('should fail validation due to missing type', () => {
      const request: Request = {
        type: '',  // Missing type
        content: 'Sample data',
        metadata: {token: 'valid-token-1'}
      };

      const response = loggingHandler.process(request);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Validation failed: Request type is required');
      expect(response.handled).toBe(true);
    });

    it('should return unhandled response for unknown request type', () => {
      const request: Request = {
        type: 'unknown',  // Unknown type
        content: 'Sample data',
        metadata: {token: 'valid-token-1'}
      };

      const response = loggingHandler.process(request);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Request could not be processed by any handler');
      expect(response.handled).toBe(false);
    });

    it('should handle multiple requests and maintain logs', () => {
      // Process multiple requests
      loggingHandler.process({
        type: 'data',
        content: 'First request',
        metadata: {token: 'valid-token-1'}
      });

      loggingHandler.process({
        type: 'command',
        content: 'Second request',
        metadata: {token: 'valid-token-2'}
      });

      // Check that logs contain both requests
      const logs = loggingHandler.getLogs();
      expect(logs.length).toBe(2);
      expect(logs[0]).toContain('First request');
      expect(logs[1]).toContain('Second request');

      // Clear logs
      loggingHandler.clearLogs();
      expect(loggingHandler.getLogs().length).toBe(0);
    });

    it('should allow creating custom pipelines with specific handlers', () => {
      // Create a simpler pipeline without authentication
      const simplePipeline = new LoggingHandler();
      simplePipeline
        .setNext(new ValidationHandler())
        .setNext(new DataRequestHandler());

      const request: Request = {
        type: 'data',
        content: 'Simple request'
        // No authentication needed
      };

      const response = simplePipeline.process(request);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Data request processed successfully');
      expect(response.handled).toBe(true);
    });
  });
});
