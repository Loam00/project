import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditComponent } from './modal-edit.component';

describe('ModalEditComponent', () => {
  let component: ModalEditComponent;
  let fixture: ComponentFixture<ModalEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditComponent]
    });
    fixture = TestBed.createComponent(ModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
