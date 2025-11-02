import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableCardListComponent } from './draggable-card-list.component';

describe('DraggableCardListComponent', () => {
  let component: DraggableCardListComponent;
  let fixture: ComponentFixture<DraggableCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableCardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggableCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
