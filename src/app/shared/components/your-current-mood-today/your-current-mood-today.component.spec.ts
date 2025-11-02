import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCurrentMoodTodayComponent } from './your-current-mood-today.component';

describe('YourCurrentMoodTodayComponent', () => {
  let component: YourCurrentMoodTodayComponent;
  let fixture: ComponentFixture<YourCurrentMoodTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourCurrentMoodTodayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourCurrentMoodTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
