import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthScaleTestComponent } from './mental-health-scale-test.component';

describe('MentalHealthScaleTestComponent', () => {
  let component: MentalHealthScaleTestComponent;
  let fixture: ComponentFixture<MentalHealthScaleTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalHealthScaleTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalHealthScaleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
