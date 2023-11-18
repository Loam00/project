import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurseComponent } from './purse.component';

describe('PurseComponent', () => {
  let component: PurseComponent;
  let fixture: ComponentFixture<PurseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurseComponent]
    });
    fixture = TestBed.createComponent(PurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
