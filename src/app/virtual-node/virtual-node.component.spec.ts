import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualNodeComponent } from './virtual-node.component';

describe('VirtualNodeComponent', () => {
  let component: VirtualNodeComponent;
  let fixture: ComponentFixture<VirtualNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
