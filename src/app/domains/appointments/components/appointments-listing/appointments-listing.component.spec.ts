import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentsListingComponent } from './appointments-listing.component';


describe('AppointmentsListingComponent', () => {
  let component: AppointmentsListingComponent;
  let fixture: ComponentFixture<AppointmentsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsListingComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
