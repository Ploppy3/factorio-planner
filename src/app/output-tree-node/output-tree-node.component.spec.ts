import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputTreeNodeComponent } from './output-tree-node.component';

describe('VirtualOutputNodeComponent', () => {
  let component: OutputTreeNodeComponent;
  let fixture: ComponentFixture<OutputTreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutputTreeNodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
