import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodShemmerComponent } from './mood-shemmer.component';

describe('MoodShemmerComponent', () => {
  let component: MoodShemmerComponent;
  let fixture: ComponentFixture<MoodShemmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodShemmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodShemmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
