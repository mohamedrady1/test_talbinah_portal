import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlineMainBtnComponent } from './outline-main-btn.component';

describe('OutlineMainBtnComponent', () => {
  let component: OutlineMainBtnComponent;
  let fixture: ComponentFixture<OutlineMainBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutlineMainBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlineMainBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
