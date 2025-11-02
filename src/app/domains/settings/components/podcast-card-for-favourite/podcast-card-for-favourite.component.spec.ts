import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastCardForFavouriteComponent } from './podcast-card-for-favourite.component';

describe('PodcastCardForFavouriteComponent', () => {
  let component: PodcastCardForFavouriteComponent;
  let fixture: ComponentFixture<PodcastCardForFavouriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastCardForFavouriteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastCardForFavouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
