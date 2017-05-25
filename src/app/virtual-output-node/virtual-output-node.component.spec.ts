import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualOutputNodeComponent } from './virtual-output-node.component';

describe('VirtualOutputNodeComponent', () => {
  let component: VirtualOutputNodeComponent;
  let fixture: ComponentFixture<VirtualOutputNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualOutputNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualOutputNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
