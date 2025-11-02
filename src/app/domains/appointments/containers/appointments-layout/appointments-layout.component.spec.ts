import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsLayoutComponent } from './appointments-layout.component';

describe('AppointmentsLayoutComponent', () => {
  let component: AppointmentsLayoutComponent;
  let fixture: ComponentFixture<AppointmentsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsLayoutComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
