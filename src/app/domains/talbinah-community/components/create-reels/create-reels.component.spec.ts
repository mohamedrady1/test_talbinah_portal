import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReelsComponent } from './create-reels.component';

describe('CreateReelsComponent', () => {
  let component: CreateReelsComponent;
  let fixture: ComponentFixture<CreateReelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
