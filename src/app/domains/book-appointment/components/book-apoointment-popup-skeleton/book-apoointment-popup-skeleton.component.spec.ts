import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookApoointmentPopupSkeletonComponent } from './book-apoointment-popup-skeleton.component';

describe('BookApoointmentPopupSkeletonComponent', () => {
  let component: BookApoointmentPopupSkeletonComponent;
  let fixture: ComponentFixture<BookApoointmentPopupSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookApoointmentPopupSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookApoointmentPopupSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
