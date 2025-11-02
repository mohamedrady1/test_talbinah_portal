import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisingDoctorsCardComponent } from './supervising-doctors-card.component';

describe('SupervisingDoctorsCardComponent', () => {
  let component: SupervisingDoctorsCardComponent;
  let fixture: ComponentFixture<SupervisingDoctorsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupervisingDoctorsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisingDoctorsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
