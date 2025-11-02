import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlineGrayBtnComponent } from './outline-gray-btn.component';

describe('OutlineGrayBtnComponent', () => {
  let component: OutlineGrayBtnComponent;
  let fixture: ComponentFixture<OutlineGrayBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutlineGrayBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlineGrayBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
