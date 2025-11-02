import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAppointmentTypeComponent } from './select-appointment-type.component';

describe('SelectAppointmentTypeComponent', () => {
  let component: SelectAppointmentTypeComponent;
  let fixture: ComponentFixture<SelectAppointmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAppointmentTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAppointmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
