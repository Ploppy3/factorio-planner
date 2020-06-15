import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { DataService } from 'app/data.service';
import { PlannerService } from 'app/planner.service';
import { TreeNodeComponent } from 'app/tree-node/tree-node.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalSettingsDialogComponent } from 'app/global-settings-dialog/global-settings-dialog.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DialogOverviewComponent } from 'app/dialog-overview/dialog-overview.component';
import { TabsService } from 'app/tabs.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  providers: [DataService, PlannerService],
})
export class TabComponent implements OnInit, AfterViewInit {

  @ViewChild('rootNode', { static: false }) rootNode: TreeNodeComponent;

  public dataVersion = this.dataService.dataVersions[0].name;
  public control_output = new FormControl(1);
  public control_recipe = new FormControl('');
  public timeUnits: string[] = ['/s', '/m', '/h'];
  public timeUnit: string = this.timeUnits[0]; // per seconds (/s)
  public filteredRecipes$: Observable<any[]>;
  public idRootNode: number;

  private tabId = -1;

  @Input() idTab: number;

  constructor(
    public dataService: DataService,
    public plannerService: PlannerService,
    private tabsService: TabsService,
    private dialogService: MatDialog,
  ) { }

  ngOnInit() {
    this.tabId = this.tabsService.getLastTabId();
    this.control_recipe.setValue(this.tabsService.tabs$.value[this.idTab]);
    this.dataService.onVersionChange$.subscribe({
      next: () => {
        this.init();
      }
    });
    this.control_output.valueChanges.subscribe(value => {
      this.rootNode.node.recipeRequest = value;
      this.plannerService.calculateTreeNodes();
    });
    this.filteredRecipes$ = this.control_recipe.valueChanges.pipe(startWith(null), map(val => this.filterRecipes(val).slice(0, 7)));
    this.control_recipe.valueChanges.subscribe(val => {
      this.init();
    });
  }

  ngAfterViewInit(): void {
    this.control_recipe.valueChanges.subscribe(val => {
      this.tabsService.renameTab(this.tabId, val);
    });
  }

  public init() {
    this.idRootNode = this.plannerService.createInMemoryTree(this.control_recipe.value, this.control_output.value);
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
    const dialogRef = this.dialogService.open(GlobalSettingsDialogComponent);
    dialogRef.componentInstance.setMachines(this.dataService.assemblingMachinesSettings);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dataService.assemblingMachinesSettings = res;
        this.init();
      }
    });
  }

  public openSharedResources() {
    const dialogRef = this.dialogService.open(DialogOverviewComponent);
    dialogRef.componentInstance.sharedResources = this.plannerService.sharedResources;
  }

  private filterRecipes(val: string): any[] {
    val = this.escapeRegExp(val);
    return val ? this.dataService.recipes.filter(recipe => new RegExp(val, 'gi').test(recipe.name)) : [];
  }

  private escapeRegExp(str: string) {
    return str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null;
  }

}
