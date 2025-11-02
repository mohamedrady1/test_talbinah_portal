import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDetailsSkeletonComponent } from './session-details-skeleton.component';

describe('SessionDetailsSkeletonComponent', () => {
  let component: SessionDetailsSkeletonComponent;
  let fixture: ComponentFixture<SessionDetailsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionDetailsSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionDetailsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
