import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidBtnComponent } from './solid-btn.component';

describe('SolidBtnComponent', () => {
  let component: SolidBtnComponent;
  let fixture: ComponentFixture<SolidBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolidBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolidBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
