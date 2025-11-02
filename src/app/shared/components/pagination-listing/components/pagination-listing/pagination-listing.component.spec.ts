import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationListingComponent } from './pagination-listing.component';

describe('PaginationListingComponent', () => {
  let component: PaginationListingComponent;
  let fixture: ComponentFixture<PaginationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
