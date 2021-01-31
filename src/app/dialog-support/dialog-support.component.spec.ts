import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogSupportComponent } from './dialog-support.component';

describe('DialogSupportComponent', () => {
  let component: DialogSupportComponent;
  let fixture: ComponentFixture<DialogSupportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
