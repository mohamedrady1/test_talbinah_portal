import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityOptionCardComponent } from './security-option-card.component';

describe('SecurityOptionCardComponent', () => {
  let component: SecurityOptionCardComponent;
  let fixture: ComponentFixture<SecurityOptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityOptionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityOptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
