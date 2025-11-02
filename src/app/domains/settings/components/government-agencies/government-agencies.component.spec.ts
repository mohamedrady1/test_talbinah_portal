import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentAgenciesComponent } from './government-agencies.component';

describe('GovernmentAgenciesComponent', () => {
  let component: GovernmentAgenciesComponent;
  let fixture: ComponentFixture<GovernmentAgenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentAgenciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
