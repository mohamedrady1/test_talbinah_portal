import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCardForFavouriteComponent } from './doctor-card-for-favourite.component';

describe('DoctorCardForFavouriteComponent', () => {
  let component: DoctorCardForFavouriteComponent;
  let fixture: ComponentFixture<DoctorCardForFavouriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCardForFavouriteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCardForFavouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
