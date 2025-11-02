import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesListingComponent } from './articles-listing.component';

describe('ArticlesListingComponent', () => {
  let component: ArticlesListingComponent;
  let fixture: ComponentFixture<ArticlesListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
