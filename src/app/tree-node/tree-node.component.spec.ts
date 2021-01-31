import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreeNodeComponent } from './tree-node.component';

describe('VirtualNodeComponent', () => {
  let component: TreeNodeComponent;
  let fixture: ComponentFixture<TreeNodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TreeNodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
