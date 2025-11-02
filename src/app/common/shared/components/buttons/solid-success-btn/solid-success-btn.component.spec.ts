import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidSuccessBtnComponent } from './solid-success-btn.component';

describe('SolidSuccessBtnComponent', () => {
  let component: SolidSuccessBtnComponent;
  let fixture: ComponentFixture<SolidSuccessBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolidSuccessBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolidSuccessBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
