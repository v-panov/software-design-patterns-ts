import {
  Context,
  ConcreteStateA,
  Document,
  DocumentStatus
} from './State';

describe('State Pattern', () => {
  describe('Basic State Implementation', () => {
    let context: Context;

    beforeEach(() => {
      context = new Context(new ConcreteStateA());
    });

    it('should change states when request is made', () => {
      expect(context.getState().getName()).toBe('State A');

      context.request();
      expect(context.getState().getName()).toBe('State B');

      context.request();
      expect(context.getState().getName()).toBe('State C');

      context.request();
      expect(context.getState().getName()).toBe('State A');
    });

    it('should log state changes and requests', () => {
      context.request();
      context.request();

      const log = context.getLog();
      expect(log).toHaveLength(5);
      expect(log[0]).toContain('initialized with State A');
      expect(log[1]).toContain('Request handled by State A');
      expect(log[2]).toContain('State changed from State A to State B');
      expect(log[3]).toContain('Request handled by State B');
      expect(log[4]).toContain('State changed from State B to State C');
    });

    it('should clear log when requested', () => {
      context.request();
      expect(context.getLog()).toHaveLength(3);

      context.clearLog();
      expect(context.getLog()).toHaveLength(0);
    });
  });

  describe('Document Approval System', () => {
    let document: Document;

    beforeEach(() => {
      document = new Document();
    });

    it('should start in draft state', () => {
      expect(document.getStatus()).toBe(DocumentStatus.DRAFT);
    });

    it('should transition from draft to moderation', () => {
      document.moderate();
      expect(document.getStatus()).toBe(DocumentStatus.MODERATION);
    });

    it('should transition from moderation to published', () => {
      document.moderate();
      document.publish();
      expect(document.getStatus()).toBe(DocumentStatus.PUBLISHED);
    });

    it('should transition from moderation to rejected', () => {
      document.moderate();
      document.reject();
      expect(document.getStatus()).toBe(DocumentStatus.REJECTED);
    });

    it('should allow archiving from any state', () => {
      document.archive();
      expect(document.getStatus()).toBe(DocumentStatus.ARCHIVED);

      document = new Document();
      document.moderate();
      document.archive();
      expect(document.getStatus()).toBe(DocumentStatus.ARCHIVED);

      document = new Document();
      document.moderate();
      document.publish();
      document.archive();
      expect(document.getStatus()).toBe(DocumentStatus.ARCHIVED);
    });

    it('should maintain document content through state changes', () => {
      document.setContent('Test document');
      document.moderate();
      document.publish();

      expect(document.getContent()).toBe('Test document');
    });

    it('should prevent publishing directly from draft', () => {
      expect(() => {
        document.publish();
      }).toThrow('Cannot publish directly from Draft state');
    });

    it('should prevent rejecting a draft', () => {
      expect(() => {
        document.reject();
      }).toThrow('Cannot reject a Draft state document');
    });

    it('should prevent rejecting a published document', () => {
      document.moderate();
      document.publish();

      expect(() => {
        document.reject();
      }).toThrow('Cannot reject a Published state document');
    });

    it('should prevent moderation of a rejected document without drafting first', () => {
      document.moderate();
      document.reject();

      expect(() => {
        document.moderate();
      }).toThrow('Rejected document must be drafted first');
    });

    it('should record document history', () => {
      document.setContent('Initial content');
      document.moderate();
      document.publish();
      document.setContent('Updated content');

      const history = document.getHistory();
      expect(history.length).toBeGreaterThanOrEqual(6);
      expect(history[0]).toContain('Document created in Draft state');
      expect(history[1]).toContain('Content updated');
      expect(history[2]).toContain('Moderation action requested');
      expect(history[3]).toContain('Status changed from Draft to Moderation');
      expect(history[4]).toContain('Publish action requested');
      expect(history[5]).toContain('Status changed from Moderation to Published');
      expect(history[6]).toContain('Content updated');
    });

    it('should allow draft from published state', () => {
      document.moderate();
      document.publish();
      document.draft();

      expect(document.getStatus()).toBe(DocumentStatus.DRAFT);
    });

    it('should allow draft from archived state', () => {
      document.archive();
      document.draft();

      expect(document.getStatus()).toBe(DocumentStatus.DRAFT);
    });

    it('should prevent operations on archived documents', () => {
      document.archive();

      expect(() => {
        document.moderate();
      }).toThrow('Cannot moderate an Archived state document');

      expect(() => {
        document.publish();
      }).toThrow('Cannot publish an Archived state document');

      expect(() => {
        document.reject();
      }).toThrow('Cannot reject an Archived state document');
    });
  });
});
