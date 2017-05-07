import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';

import { Node } from "../node";
import { DataService } from "../data.service";
import { PlannerService } from "../planner.service";

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
  ) { }

  ngOnInit() {
    this.node.parent = new Node(this.dataService, this.plannerService);
    this.control_output.valueChanges.subscribe(_ => { this.node.calculate(); console.log('changed') });
    this.$filteredRecipes = this.control_recipe.valueChanges.startWith(null).map(val => this.filterRecipes(val).slice(0, 7));
    this.control_recipe.valueChanges.subscribe(val => { this.node.name = val; this.node.findRecipeByName(); });
  }

  public reload() {
    this.node.findRecipeByName();
  }

  private filterRecipes(val: string): any[] {
    return val ? this.dataService.recipes.filter(recipe => new RegExp(`${val}`, 'gi').test(recipe.name)) : this.dataService.recipes;
  }

  public onExpensiveRecipesValueChange(value: boolean) {
    this.plannerService.useExpensiveRecipes$.next(value);
    this.node.findRecipeByName();
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

}
