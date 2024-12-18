import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
  });

  /**
   * Test to check if the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test to check if messages can be cleared.
   */
  it('should clear all messages', async () => {
    service.getAllMessages();
    service.messages$.subscribe(messages => {
      expect(messages.length).toBe(0);
    });
  });

  /**
   * Test to check if a new message can be added.
   */
  it('should add a new message', async () => {
    const newMessage = { isSentByUser: true, content: 'Hello, world!' };
    await service.addMessage(newMessage, 'fall2024', 'CS101-01');
    service.messages$.subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages[0]).toEqual(newMessage);
    });
  });
});