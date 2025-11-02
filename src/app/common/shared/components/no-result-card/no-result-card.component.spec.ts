import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultCardComponent } from './no-result-card.component';

describe('NoResultCardComponent', () => {
  let component: NoResultCardComponent;
  let fixture: ComponentFixture<NoResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoResultCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
