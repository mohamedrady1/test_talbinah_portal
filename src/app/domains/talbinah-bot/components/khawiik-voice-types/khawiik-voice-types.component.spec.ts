import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikVoiceTypesComponent } from './khawiik-voice-types.component';

describe('KhawiikVoiceTypesComponent', () => {
  let component: KhawiikVoiceTypesComponent;
  let fixture: ComponentFixture<KhawiikVoiceTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikVoiceTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikVoiceTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
