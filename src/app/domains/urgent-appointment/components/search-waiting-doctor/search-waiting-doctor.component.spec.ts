import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWaitingDoctorComponent } from './search-waiting-doctor.component';

describe('SearchWaitingDoctorComponent', () => {
  let component: SearchWaitingDoctorComponent;
  let fixture: ComponentFixture<SearchWaitingDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchWaitingDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchWaitingDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
