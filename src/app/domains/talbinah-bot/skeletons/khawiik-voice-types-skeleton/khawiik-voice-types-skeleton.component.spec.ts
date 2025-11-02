import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikVoiceTypesSkeletonComponent } from './khawiik-voice-types-skeleton.component';

describe('KhawiikVoiceTypesSkeletonComponent', () => {
  let component: KhawiikVoiceTypesSkeletonComponent;
  let fixture: ComponentFixture<KhawiikVoiceTypesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikVoiceTypesSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikVoiceTypesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
