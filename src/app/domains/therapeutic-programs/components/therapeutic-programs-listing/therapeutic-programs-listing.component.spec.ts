import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticProgramsListingComponent } from './therapeutic-programs-listing.component';

describe('TherapeuticProgramsListingComponent', () => {
  let component: TherapeuticProgramsListingComponent;
  let fixture: ComponentFixture<TherapeuticProgramsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapeuticProgramsListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapeuticProgramsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
