import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentBoxSkeletonComponent } from './comment-box-skeleton.component';

describe('CommentBoxSkeletonComponent', () => {
  let component: CommentBoxSkeletonComponent;
  let fixture: ComponentFixture<CommentBoxSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentBoxSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentBoxSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
