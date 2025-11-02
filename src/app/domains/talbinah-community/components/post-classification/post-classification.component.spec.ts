import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostClassificationComponent } from './post-classification.component';

describe('PostClassificationComponent', () => {
  let component: PostClassificationComponent;
  let fixture: ComponentFixture<PostClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostClassificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
