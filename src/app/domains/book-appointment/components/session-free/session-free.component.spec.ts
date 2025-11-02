import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFreeComponent } from './session-free.component';

describe('SessionFreeComponent', () => {
  let component: SessionFreeComponent;
  let fixture: ComponentFixture<SessionFreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
