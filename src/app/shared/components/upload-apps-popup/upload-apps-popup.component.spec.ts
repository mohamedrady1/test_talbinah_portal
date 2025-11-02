import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAppsPopupComponent } from './upload-apps-popup.component';

describe('UploadAppsPopupComponent', () => {
  let component: UploadAppsPopupComponent;
  let fixture: ComponentFixture<UploadAppsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAppsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAppsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
