import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCardShimmerComponent } from './article-card-shimmer.component';

describe('ArticleCardShimmerComponent', () => {
  let component: ArticleCardShimmerComponent;
  let fixture: ComponentFixture<ArticleCardShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCardShimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleCardShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
