import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAttachmentsMenuSelectorComponent } from './upload-attachments-menu-selector.component';

describe('UploadAttachmentsMenuSelectorComponent', () => {
  let component: UploadAttachmentsMenuSelectorComponent;
  let fixture: ComponentFixture<UploadAttachmentsMenuSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAttachmentsMenuSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAttachmentsMenuSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
