import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseYourMoodComponent } from './choose-your-mood.component';

describe('ChooseYourMoodComponent', () => {
  let component: ChooseYourMoodComponent;
  let fixture: ComponentFixture<ChooseYourMoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseYourMoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseYourMoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
