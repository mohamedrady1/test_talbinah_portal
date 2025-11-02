import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallNewAppointementComponent } from './recall-new-appointement.component';

describe('RecallNewAppointementComponent', () => {
  let component: RecallNewAppointementComponent;
  let fixture: ComponentFixture<RecallNewAppointementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallNewAppointementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallNewAppointementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
