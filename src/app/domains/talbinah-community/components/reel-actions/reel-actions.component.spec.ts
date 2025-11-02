import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReelActionsComponent } from './reel-actions.component';

describe('ReelActionsComponent', () => {
  let component: ReelActionsComponent;
  let fixture: ComponentFixture<ReelActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReelActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReelActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
