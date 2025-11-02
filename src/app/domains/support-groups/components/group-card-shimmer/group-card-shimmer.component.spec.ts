import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCardShimmerComponent } from './group-card-shimmer.component';

describe('GroupCardShimmerComponent', () => {
  let component: GroupCardShimmerComponent;
  let fixture: ComponentFixture<GroupCardShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupCardShimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupCardShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
