import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideFilterationSkeletonComponent } from './aside-filteration-skeleton.component';

describe('AsideFilterationSkeletonComponent', () => {
  let component: AsideFilterationSkeletonComponent;
  let fixture: ComponentFixture<AsideFilterationSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideFilterationSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideFilterationSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
