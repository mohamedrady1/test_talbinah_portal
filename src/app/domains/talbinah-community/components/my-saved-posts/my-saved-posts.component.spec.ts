import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySavedPostsComponent } from './my-saved-posts.component';

describe('MySavedPostsComponent', () => {
  let component: MySavedPostsComponent;
  let fixture: ComponentFixture<MySavedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySavedPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySavedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
