import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikBooksComponent } from './khawiik-books.component';

describe('KhawiikBooksComponent', () => {
  let component: KhawiikBooksComponent;
  let fixture: ComponentFixture<KhawiikBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
