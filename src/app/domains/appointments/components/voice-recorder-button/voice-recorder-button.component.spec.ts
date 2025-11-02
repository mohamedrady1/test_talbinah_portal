import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceRecorderButtonComponent } from './voice-recorder-button.component';

describe('VoiceRecorderButtonComponent', () => {
  let component: VoiceRecorderButtonComponent;
  let fixture: ComponentFixture<VoiceRecorderButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceRecorderButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceRecorderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
