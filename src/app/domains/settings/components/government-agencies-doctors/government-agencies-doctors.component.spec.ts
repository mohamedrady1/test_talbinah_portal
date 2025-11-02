import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentAgenciesDoctorsComponent } from './government-agencies-doctors.component';

describe('GovernmentAgenciesDoctorsComponent', () => {
  let component: GovernmentAgenciesDoctorsComponent;
  let fixture: ComponentFixture<GovernmentAgenciesDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentAgenciesDoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentAgenciesDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
