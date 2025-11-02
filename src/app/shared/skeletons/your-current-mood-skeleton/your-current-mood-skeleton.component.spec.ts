import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCurrentMoodSkeletonComponent } from './your-current-mood-skeleton.component';

describe('YourCurrentMoodSkeletonComponent', () => {
  let component: YourCurrentMoodSkeletonComponent;
  let fixture: ComponentFixture<YourCurrentMoodSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourCurrentMoodSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourCurrentMoodSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
