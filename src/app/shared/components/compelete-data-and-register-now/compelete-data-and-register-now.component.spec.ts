import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompeleteDataAndRegisterNowComponent } from './compelete-data-and-register-now.component';

describe('CompeleteDataAndRegisterNowComponent', () => {
  let component: CompeleteDataAndRegisterNowComponent;
  let fixture: ComponentFixture<CompeleteDataAndRegisterNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompeleteDataAndRegisterNowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompeleteDataAndRegisterNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
