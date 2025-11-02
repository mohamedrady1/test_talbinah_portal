import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodStatisticsComponent } from './mood-statistics.component';

describe('MoodStatisticsComponent', () => {
  let component: MoodStatisticsComponent;
  let fixture: ComponentFixture<MoodStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
