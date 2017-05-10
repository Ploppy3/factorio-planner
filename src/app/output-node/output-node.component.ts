import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MdDialog, MdDialogRef } from "@angular/material";

import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';

import { Node } from "../node";
import { DataService } from "../data.service";
import { PlannerService } from "../planner.service";
import { GlobalSettingsDialogComponent } from "../global-settings-dialog/global-settings-dialog.component";

@Component({
  selector: 'app-output-node',
  templateUrl: './output-node.component.html',
  styleUrls: ['./output-node.component.css'],
})
export class OutputNodeComponent implements OnInit {

  public node = new Node(this.dataService, this.plannerService);
  public control_output = new FormControl();
  public control_recipe = new FormControl();
  public $filteredRecipes: Observable<any[]>;

  public timeUnits: string[] = ['/s', '/m', '/h'];
  public timeUnit: string = this.timeUnits[0];
  public timeFactor: number = 0;

  constructor(
    public dataService: DataService,
    public plannerService: PlannerService,
    private mdDialog: MdDialog,
  ) { }

  ngOnInit() {
    this.node.parent = new Node(this.dataService, this.plannerService);
    this.control_output.valueChanges.subscribe(_ => this.node.calculate());
    this.$filteredRecipes = this.control_recipe.valueChanges.startWith(null).map(val => this.filterRecipes(val).slice(0, 7));
    this.control_recipe.valueChanges.subscribe(val => { this.node.name = val; this.node.findRecipeByName(); });
    this.plannerService.useExpensiveRecipes$.subscribe(useExpensiveRecipes => { this.node.findRecipeByName(); });
    //this.control_recipe.setValue('science-pack-3');
  }

  public fullRefresh() { // force refresh of component
    this.node.findRecipeByName();
  }

  private filterRecipes(val: string): any[] {
    return val ? this.dataService.recipes.filter(recipe => new RegExp(`${val}`, 'gi').test(recipe.name)) : [];
  }

  public onExpensiveRecipesValueChange(value: boolean) {
    this.plannerService.useExpensiveRecipes$.next(value);
    //this.node.findRecipeByName();
    //this.node.calculateEverything();
    //this.node.calculate();
  }

  public onTimeUnitChange() {
    switch (this.timeUnit) {
      case '/s':
        this.plannerService.timeFactor$.next(1);
        break;
      case '/m':
        this.plannerService.timeFactor$.next(1/60);
        break;
      case '/h':
        this.plannerService.timeFactor$.next(1/3600);
        break;
    
      default:
        console.warn('unkown time factor');
        break;
    }
    this.node.calculate();
  }

  public openGlobalSettings() {
    let dialogRef = this.mdDialog.open(GlobalSettingsDialogComponent);
    dialogRef.componentInstance.setMachines(this.dataService.assemblingMachinesSettings);
    dialogRef.afterClosed().subscribe(res => {
      //console.log(this.dataService.assemblingMachinesSettings);
      if (res) {
        //console.log('saving settings');
        this.dataService.assemblingMachinesSettings = res;
        this.node.findRecipeByName();
      }
    })
  }

}
