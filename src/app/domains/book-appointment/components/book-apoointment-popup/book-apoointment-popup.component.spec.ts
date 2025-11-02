import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookApoointmentPopupComponent } from './book-apoointment-popup.component';

describe('BookApoointmentPopupComponent', () => {
  let component: BookApoointmentPopupComponent;
  let fixture: ComponentFixture<BookApoointmentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookApoointmentPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookApoointmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
