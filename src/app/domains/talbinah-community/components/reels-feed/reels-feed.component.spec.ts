import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReelsFeedComponent } from './reels-feed.component';

describe('ReelsFeedComponent', () => {
  let component: ReelsFeedComponent;
  let fixture: ComponentFixture<ReelsFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReelsFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReelsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
