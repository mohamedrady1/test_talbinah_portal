import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesFavouriteListComponent } from './articles-favourite-list.component';

describe('ArticlesFavouriteListComponent', () => {
  let component: ArticlesFavouriteListComponent;
  let fixture: ComponentFixture<ArticlesFavouriteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesFavouriteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesFavouriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
