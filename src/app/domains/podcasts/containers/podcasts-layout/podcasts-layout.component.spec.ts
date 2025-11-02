import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastsLayoutComponent } from './podcasts-layout.component';

describe('PodcastsLayoutComponent', () => {
  let component: PodcastsLayoutComponent;
  let fixture: ComponentFixture<PodcastsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
