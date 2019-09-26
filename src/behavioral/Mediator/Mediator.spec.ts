import {
  ChatRoom,
  RegularUser,
  PremiumUser,
  AdminUser
} from './Mediator';

describe('Mediator Pattern', () => {
  let chatRoom: ChatRoom;
  let user1: RegularUser;
  let user2: RegularUser;
  let premiumUser: PremiumUser;
  let adminUser: AdminUser;

  beforeEach(() => {
    // Set up a fresh chat room and users for each test
    chatRoom = new ChatRoom();
    user1 = new RegularUser(chatRoom, 'Alice');
    user2 = new RegularUser(chatRoom, 'Bob');
    premiumUser = new PremiumUser(chatRoom, 'Charlie');
    adminUser = new AdminUser(chatRoom, 'Admin');

    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {
    });
  });

  afterEach(() => {
    // Restore console.log
    jest.restoreAllMocks();
  });

  describe('Basic chat functionality', () => {
    it('should add users to the chat room', () => {
      expect(chatRoom.getUserCount()).toBe(4);
    });

    it('should allow users to send messages to all other users', () => {
      user1.send('Hello everyone!');

      // Check that other users received the message
      expect(user2.getMessages()).toHaveLength(1);
      expect(user2.getMessages()[0]).toContain('Alice: Hello everyone!');

      expect(premiumUser.getMessages()).toHaveLength(1);
      expect(premiumUser.getMessages()[0]).toContain('Alice: Hello everyone!');

      expect(adminUser.getMessages()).toHaveLength(1);
      expect(adminUser.getMessages()[0]).toContain('Alice: Hello everyone!');

      // Sender should not receive their own message
      expect(user1.getMessages()).toHaveLength(0);
    });

    it('should record system messages when users join/leave', () => {
      const newUser = new RegularUser(chatRoom, 'Dave');
      expect(chatRoom.getMessageLog()).toContain('[SYSTEM] Dave has joined the chat.');

      newUser.disconnect();
      expect(chatRoom.getMessageLog()).toContain('[SYSTEM] Dave has left the chat.');
    });
  });

  describe('PremiumUser functionality', () => {
    it('should allow setting away status', () => {
      premiumUser.setAwayStatus(true);
      expect(premiumUser.getAwayStatus()).toBe(true);

      premiumUser.setAwayStatus(false);
      expect(premiumUser.getAwayStatus()).toBe(false);
    });

    it('should not send messages when away', () => {
      premiumUser.setAwayStatus(true);
      premiumUser.send('This should not be sent');

      // Verify no one received the message
      expect(user1.getMessages()).toHaveLength(0);
      expect(user2.getMessages()).toHaveLength(0);
      expect(adminUser.getMessages()).toHaveLength(0);

      // Verify it was logged to console that message wasn't sent
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('cannot send messages while away'));
    });

    it('should auto-reply with away message when receiving messages', () => {
      premiumUser.setAwayStatus(true, "I'm in a meeting");

      // Someone sends a message to the premium user
      user1.send('Hey Charlie, are you there?');

      // Check that the auto-reply was sent
      expect(user1.getMessages()).toHaveLength(1);
      expect(user1.getMessages()[0]).toContain("I'm in a meeting");

      // Check that user2 also received the auto-reply
      expect(user2.getMessages()).toHaveLength(2);
      expect(user2.getMessages()[0]).toContain('Alice: Hey Charlie, are you there?');
      expect(user2.getMessages()[1]).toContain("I'm in a meeting");
    });
  });

  describe('AdminUser functionality', () => {
    it('should broadcast announcements to all users', () => {
      adminUser.broadcastAnnouncement('Server maintenance in 10 minutes');

      // Check that all users received the announcement
      expect(user1.getMessages()).toHaveLength(1);
      expect(user1.getMessages()[0]).toContain('ANNOUNCEMENT: Server maintenance');

      expect(user2.getMessages()).toHaveLength(1);
      expect(user2.getMessages()[0]).toContain('ANNOUNCEMENT: Server maintenance');

      expect(premiumUser.getMessages()).toHaveLength(1);
      expect(premiumUser.getMessages()[0]).toContain('ANNOUNCEMENT: Server maintenance');
    });

    it('should allow admin to view all messages', () => {
      user1.send('Hello!');
      user2.send('Hi there!');
      premiumUser.send('Hey everyone!');

      const allMessages = adminUser.viewAllMessages(chatRoom);

      // Check system messages and the 3 user messages
      expect(allMessages.length).toBeGreaterThanOrEqual(7); // 4 system messages (users joining) + 3 chat messages

      // Verify specific messages are in the log
      expect(allMessages.some(msg => msg.includes('Alice: Hello!'))).toBe(true);
      expect(allMessages.some(msg => msg.includes('Bob: Hi there!'))).toBe(true);
      expect(allMessages.some(msg => msg.includes('Charlie: Hey everyone!'))).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle removing a user that is not in the chat room', () => {
      const outsideUser = new RegularUser(new ChatRoom(), 'Outsider');

      // Should not throw an error
      expect(() => chatRoom.removeUser(outsideUser)).not.toThrow();

      // Chat room user count should remain unchanged
      expect(chatRoom.getUserCount()).toBe(4);
    });

    it('should not add the same user twice', () => {
      // Try to add user1 again
      chatRoom.addUser(user1);

      // User count should still be 4
      expect(chatRoom.getUserCount()).toBe(4);
    });
  });
});
