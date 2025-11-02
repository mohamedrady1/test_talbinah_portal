import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationPackageItemFormComponent } from './reservation-package-item-form.component';

describe('ReservationPackageItemFormComponent', () => {
  let component: ReservationPackageItemFormComponent;
  let fixture: ComponentFixture<ReservationPackageItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPackageItemFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationPackageItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
