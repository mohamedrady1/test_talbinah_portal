import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthScalesLayoutComponent } from './mental-health-scales-layout.component';

describe('MentalHealthScalesLayoutComponent', () => {
  let component: MentalHealthScalesLayoutComponent;
  let fixture: ComponentFixture<MentalHealthScalesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalHealthScalesLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalHealthScalesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
