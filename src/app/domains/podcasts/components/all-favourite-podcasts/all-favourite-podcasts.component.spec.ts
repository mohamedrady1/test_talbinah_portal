import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFavouritePodcastsComponent } from './all-favourite-podcasts.component';

describe('AllFavouritePodcastsComponent', () => {
  let component: AllFavouritePodcastsComponent;
  let fixture: ComponentFixture<AllFavouritePodcastsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllFavouritePodcastsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllFavouritePodcastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
