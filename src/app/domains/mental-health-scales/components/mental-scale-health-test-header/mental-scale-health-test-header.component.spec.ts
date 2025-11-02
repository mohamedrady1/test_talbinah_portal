import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalScaleHealthTestHeaderComponent } from './mental-scale-health-test-header.component';

describe('MentalScaleHealthTestHeaderComponent', () => {
  let component: MentalScaleHealthTestHeaderComponent;
  let fixture: ComponentFixture<MentalScaleHealthTestHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalScaleHealthTestHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalScaleHealthTestHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
