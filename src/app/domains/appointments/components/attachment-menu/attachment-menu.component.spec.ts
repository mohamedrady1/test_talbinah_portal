import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentMenuComponent } from './attachment-menu.component';

describe('AttachmentMenuComponent', () => {
  let component: AttachmentMenuComponent;
  let fixture: ComponentFixture<AttachmentMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
