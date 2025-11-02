import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockDoctorModalComponent } from './block-doctor-modal.component';

describe('BlockDoctorModalComponent', () => {
  let component: BlockDoctorModalComponent;
  let fixture: ComponentFixture<BlockDoctorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockDoctorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockDoctorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
