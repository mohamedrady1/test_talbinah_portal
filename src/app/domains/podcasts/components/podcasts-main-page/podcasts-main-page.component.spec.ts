import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastsMainPageComponent } from './podcasts-main-page.component';

describe('PodcastsMainPageComponent', () => {
  let component: PodcastsMainPageComponent;
  let fixture: ComponentFixture<PodcastsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
