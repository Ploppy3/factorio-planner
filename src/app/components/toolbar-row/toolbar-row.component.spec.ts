import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarRowComponent } from './toolbar-row.component';

describe('ToolbarRowComponent', () => {
  let component: ToolbarRowComponent;
  let fixture: ComponentFixture<ToolbarRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
