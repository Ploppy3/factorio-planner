
import { map, startWith } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { TreeNode } from '../tree-node';
import { DataService } from '../data.service';
import { PlannerService } from '../planner.service';
import { GlobalSettingsDialogComponent } from '../global-settings-dialog/global-settings-dialog.component';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
import { reveal } from '../animations';
import { TabsService } from 'app/tabs.service';

@Component({
  selector: 'app-output-tree-node',
  templateUrl: './output-tree-node.component.html',
  styleUrls: ['./output-tree-node.component.scss'],
  animations: [reveal],
})
export class OutputTreeNodeComponent implements OnInit, AfterViewInit {

  public node = new TreeNode(this.plannerService, 'test');
  public control_output = new FormControl();
  public control_recipe = new FormControl();
  public filteredRecipes$: Observable<any[]>;
  public showChilds = true;

  public timeUnits: string[] = ['/s', '/m', '/h'];
  public timeUnit: string = this.timeUnits[0]; // per seconds (/s)
  public timeFactor = 0;

  private tabId = -1;

  constructor(
    public dataService: DataService,
    public plannerService: PlannerService,
    public tabsService: TabsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.tabId = this.tabsService.getLastTabId();
    this.control_output.valueChanges.subscribe(value => {
      console.log('control_output.valueChanges')
      this.node.recipeRequest = value;
      this.plannerService.calculateTreeNodes();
    });
    this.filteredRecipes$ = this.control_recipe.valueChanges.pipe(startWith(null), map(val => this.filterRecipes(val).slice(0, 7)));
    this.control_recipe.valueChanges.subscribe(val => {
      console.log('control_recipe.valueChanges')
      this.node.name = val;
      this.getNode();
    });
    this.plannerService.useExpensiveRecipes$.subscribe(useExpensiveRecipes => {
      console.log('expensive state changed, refreshing');
      this.getNode();
    });
    this.control_recipe.setValue('automation-science-pack');
  }

  ngAfterViewInit(): void {
    this.control_recipe.valueChanges.subscribe(val => {
      this.tabsService.tabName$.next({ tabId: this.tabId, name: val });
    });
  }

  private getNode() {
    this.plannerService.generateTree(this.control_recipe.value);
    this.node = this.plannerService.virtualTree[0];
  }

  private filterRecipes(val: string): any[] {
    val = this.escapeRegExp(val);
    return val ? this.dataService.recipes.filter(recipe => new RegExp(val, 'gi').test(recipe.name)) : [];
  }

  private escapeRegExp(str: string) {
    return str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null;
  }

  public onExpensiveRecipesValueChange(value: boolean) {
    this.plannerService.useExpensiveRecipes$.next(value);
  }

  public onTimeUnitChange() {
    switch (this.timeUnit) {
      case '/s':
        this.plannerService.timeFactor$.next(1);
        break;
      case '/m':
        this.plannerService.timeFactor$.next(1 / 60);
        break;
      case '/h':
        this.plannerService.timeFactor$.next(1 / 3600);
        break;

      default:
        console.warn('unkown time factor');
        break;
    }
  }

  public openGlobalSettings() {
    const dialogRef = this.dialog.open(GlobalSettingsDialogComponent);
    dialogRef.componentInstance.setMachines(this.dataService.assemblingMachinesSettings);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dataService.assemblingMachinesSettings = res;
        this.getNode();
      }
    });
  }

  public openSharedResources() {
    const dialogRef = this.dialog.open(DialogOverviewComponent);
    dialogRef.componentInstance.sharedResources = this.plannerService.sharedResources;
  }

  public fullRefresh() {
    this.getNode();
  }
}
