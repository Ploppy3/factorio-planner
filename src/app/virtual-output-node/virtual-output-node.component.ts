
import {map, startWith} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { NgZone } from "@angular/core";

import { Subscription ,  Observable } from 'rxjs';




import { VirtualNode } from "../virtual-node";
import { DataService } from "../data.service";
import { PlannerService } from "../planner.service";
import { GlobalSettingsDialogComponent } from "../global-settings-dialog/global-settings-dialog.component";
import { DialogOverviewComponent } from "../dialog-overview/dialog-overview.component";
import { reveal } from "../animations";

import { environment } from "../../environments/environment";

@Component({
  selector: 'app-virtual-output-node',
  templateUrl: './virtual-output-node.component.html',
  styleUrls: ['./virtual-output-node.component.css'],
  animations: [reveal]
})
export class VirtualOutputNodeComponent implements OnInit {

  public node = new VirtualNode(this.plannerService, 'test');
  public control_output = new FormControl();
  public control_recipe = new FormControl();
  public $filteredRecipes: Observable<any[]>;
  public showChilds = true;

  public timeUnits: string[] = ['/s', '/m', '/h'];
  public timeUnit: string = this.timeUnits[0]; // /s
  public timeFactor: number = 0;

  constructor(
    public dataService: DataService,
    public plannerService: PlannerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.control_output.valueChanges.subscribe(_ => {
      this.plannerService.resetSharedRessources();
      this.plannerService.calculateAllNodes();
      //this.node.calculate();
    });
    this.$filteredRecipes = this.control_recipe.valueChanges.pipe(startWith(null),map(val => this.filterRecipes(val).slice(0, 7)),);
    this.control_recipe.valueChanges.subscribe(val => {
      this.node.name = val;
      this.getNode();
    });
    this.plannerService.useExpensiveRecipes$.subscribe(useExpensiveRecipes => {
      console.log('expensive state changed, refreshing');
      this.getNode();
    });
    this.control_recipe.setValue('science-pack-1');
  }

  private getNode() {
    this.plannerService.resetSharedRessources();
    let id = this.plannerService.createInMemoryTree(this.control_recipe.value);
    this.node = this.plannerService.virtualTree[id];
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
    this.plannerService.resetSharedRessources();
  }

  public openGlobalSettings() {
    let dialogRef = this.dialog.open(GlobalSettingsDialogComponent);
    dialogRef.componentInstance.setMachines(this.dataService.assemblingMachinesSettings);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dataService.assemblingMachinesSettings = res;
        this.getNode();
      }
    });
  }

  public openSharedResources() {
    let dialogRef = this.dialog.open(DialogOverviewComponent);
    this.plannerService.resetSharedRessources();
    /*
    this.plannerService.virtualTree.forEach(node => {
      node.getSharedResources();
    });
    */
    for (var key in this.plannerService.virtualTree) {
      if (this.plannerService.virtualTree.hasOwnProperty(key)) {
        this.plannerService.virtualTree[key].getSharedResources();
      }
    }
    let sharedResources = [];
    for (let key in this.plannerService.sharedResources) {
      sharedResources.push({ name: key, throughput: this.plannerService.sharedResources[key] });
    }
    dialogRef.componentInstance.sharedResources = sharedResources;
  }

  public fullRefresh() {
    this.getNode();
  }
}
