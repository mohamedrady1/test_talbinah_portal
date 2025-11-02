import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidDangerBtnComponent } from './solid-danger-btn.component';

describe('SolidDangerBtnComponent', () => {
  let component: SolidDangerBtnComponent;
  let fixture: ComponentFixture<SolidDangerBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolidDangerBtnComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SolidDangerBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
