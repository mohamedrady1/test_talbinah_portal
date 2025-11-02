import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthScaleTestResultComponent } from './mental-health-scale-test-result.component';

describe('MentalHealthScaleTestResultComponent', () => {
  let component: MentalHealthScaleTestResultComponent;
  let fixture: ComponentFixture<MentalHealthScaleTestResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalHealthScaleTestResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalHealthScaleTestResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
