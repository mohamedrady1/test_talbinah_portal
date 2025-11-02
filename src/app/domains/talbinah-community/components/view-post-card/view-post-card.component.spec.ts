import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPostCardComponent } from './view-post-card.component';

describe('ViewPostCardComponent', () => {
  let component: ViewPostCardComponent;
  let fixture: ComponentFixture<ViewPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPostCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
