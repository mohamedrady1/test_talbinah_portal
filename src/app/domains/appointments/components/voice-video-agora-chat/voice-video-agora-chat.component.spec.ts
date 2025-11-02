import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceVideoAgoraChatComponent } from './voice-video-agora-chat.component';

describe('VoiceVideoAgoraChatComponent', () => {
  let component: VoiceVideoAgoraChatComponent;
  let fixture: ComponentFixture<VoiceVideoAgoraChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceVideoAgoraChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceVideoAgoraChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
