import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallTypeSelectorComponent } from './call-type-selector.component';

describe('CallTypeSelectorComponent', () => {
  let component: CallTypeSelectorComponent;
  let fixture: ComponentFixture<CallTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallTypeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
