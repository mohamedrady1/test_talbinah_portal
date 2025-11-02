import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthScaleStartTestComponent } from './mental-health-scale-start-test.component';

describe('MentalHealthScaleStartTestComponent', () => {
  let component: MentalHealthScaleStartTestComponent;
  let fixture: ComponentFixture<MentalHealthScaleStartTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalHealthScaleStartTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalHealthScaleStartTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
