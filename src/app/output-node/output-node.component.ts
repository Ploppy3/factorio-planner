import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';
import { Observable } from "rxjs/Observable";

import { Node } from "../node";
import { fadeInOut, reveal } from "../animations";
import { DataService } from "../data.service";

@Component({
  selector: 'app-output-node',
  templateUrl: './output-node.component.html',
  styleUrls: ['./output-node.component.css'],
  animations: [fadeInOut, reveal],
})
export class OutputNodeComponent implements OnInit {

  public node = new Node();
  public control_output = new FormControl();
  public control_recipe = new FormControl();
  public filteredRecipes: Observable<any>;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.node.parent = new Node();
    this.control_output.valueChanges.subscribe(_ => { this.node.calculate(); console.log('changed')});
    this.filteredRecipes = this.control_recipe.valueChanges.startWith(null).map(val => this.filterRecipes(val).slice(0, 7));
    this.control_recipe.valueChanges.subscribe(val => { this.node.name = val; this.node.findRecipeByName(this.dataService); });
  }

  public reload() {
    this.node.findRecipeByName(this.dataService);
  }
  
  private filterRecipes(val: string): any[] {
    return val ? this.dataService.recipes.filter(recipe => new RegExp(`${val}`, 'gi').test(recipe.name))
               : this.dataService.recipes;
  }

}
