import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRatingModalComponent } from './leave-rating-modal.component';

describe('LeaveRatingModalComponent', () => {
  let component: LeaveRatingModalComponent;
  let fixture: ComponentFixture<LeaveRatingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRatingModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRatingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
