import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastDetailsBoxCardComponent } from './podcast-details-box-card.component';

describe('PodcastDetailsBoxCardComponent', () => {
  let component: PodcastDetailsBoxCardComponent;
  let fixture: ComponentFixture<PodcastDetailsBoxCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastDetailsBoxCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastDetailsBoxCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
