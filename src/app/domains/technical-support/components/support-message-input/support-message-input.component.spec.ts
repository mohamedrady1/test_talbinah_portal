import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMessageInputComponent } from './support-message-input.component';

describe('SupportMessageInputComponent', () => {
  let component: SupportMessageInputComponent;
  let fixture: ComponentFixture<SupportMessageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportMessageInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportMessageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
