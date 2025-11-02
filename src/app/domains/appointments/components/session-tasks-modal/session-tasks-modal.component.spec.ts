import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTasksModalComponent } from './session-tasks-modal.component';

describe('SessionTasksModalComponent', () => {
  let component: SessionTasksModalComponent;
  let fixture: ComponentFixture<SessionTasksModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTasksModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTasksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
