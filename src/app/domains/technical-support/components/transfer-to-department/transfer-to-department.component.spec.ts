import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferToDepartmentComponent } from './transfer-to-department.component';

describe('TransferToDepartmentComponent', () => {
  let component: TransferToDepartmentComponent;
  let fixture: ComponentFixture<TransferToDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferToDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferToDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
