import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodGraphComponent } from './mood-graph.component';

describe('MoodGraphComponent', () => {
  let component: MoodGraphComponent;
  let fixture: ComponentFixture<MoodGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
