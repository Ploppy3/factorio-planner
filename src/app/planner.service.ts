import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataService } from "./data.service";
import { Node } from "./node";
import { VirtualNode } from "./virtual-node";

@Injectable()
export class PlannerService {
  
  public useExpensiveRecipes$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public timeFactor$: BehaviorSubject<number> = new BehaviorSubject(1); // 1 || 1/60 || 1/3600 (set set by output node)
  public sharedResources: {} = {};

  //experimental
  public virtualTree = {};
  private virtualTreePointer = 0;

  constructor(
    private dataService: DataService,
  ) {
    console.log('constructor');
    this.useExpensiveRecipes$.subscribe();
    this.timeFactor$.subscribe();
  }

  public addSharedResource(name: string, throughput: number) {
    if (name == 'Item') return;
    if (this.sharedResources[name])
      this.sharedResources[name] += throughput;
    else
      this.sharedResources[name] = throughput;
    //console.log(this.sharedResources);
  }

  public resetSharedRessources() {
    this.sharedResources = [];
  }

  public createInMemoryTree(recipeName: string): number {
    this.virtualTree = {};
    console.log('creating in memory tree for', recipeName);
    let rootNode = new VirtualNode(this, recipeName);
    let rootId = this.virtualTreePointer;
    this.processNode(rootNode);
    for (var key in this.virtualTree) {
      if (this.virtualTree.hasOwnProperty(key)) {
        let node = this.virtualTree[key];
        node.calculate();
      }
    }
    return rootId;
    /*
    this.virtualTree.forEach(node => {
      node.calculate();
    });
    */
    //console.log(this.virtualTree);
  }

  private getRecipe(name: string) {
    return this.dataService.recipesObject[name] ? this.dataService.recipesObject[name] : null;
  }
  
  private processNode(node: VirtualNode, parentId?: number): number {
    node.recipe = this.getRecipe(node.name);
    node.quantityPerCraft = this.getQuantityPerCraft(node.recipe);
    node.category = this.getCraftingCategory(node.recipe);
    node.craftingTime = this.getCraftingTime(node.recipe);
    /*
    this.virtualTree.push(node);
    let nodeId = this.virtualTree.indexOf(node);
    */
    this.virtualTree[this.virtualTreePointer] = node;
    let nodeId = this.virtualTreePointer;
    this.virtualTreePointer++;
    //console.log('node', node.name, 'id', nodeId);
    let ingredients = this.getIngredients(node);
    //console.log('ingredients', ingredients);
    ingredients.forEach(ingredient => {
      let childNode: VirtualNode;
      if (Array.isArray(ingredient)) { // type 1 - array
        childNode = new VirtualNode(this, ingredient[0]); // [0]:name, [1]:amount
        childNode.recipeRequest = ingredient[1];
      } else { // type 2 - object
        childNode = new VirtualNode(this, ingredient.name); // name, amount
        childNode.recipeRequest = ingredient.amount;
      }
      childNode.idParent = nodeId;
      node.childsIds.push(this.processNode(childNode));
    });
    node.machines = this.getCraftingMachines(node.category, ingredients.length);
    node.craftingMachine = node.machines[0] || null;
    return nodeId;
  }

  private getIngredients(node: VirtualNode): any[] {
    if (!node.recipe) return [];
    let ingredients: any[] = [];
    if (node.recipe.expensive && this.useExpensiveRecipes$.value) { // expensive
      if (node.recipe.expensive.ingredients) ingredients = node.recipe.expensive.ingredients;
      //console.log('using expensive recipe', node.recipe.name, ingredients);
    } else if (node.recipe.normal) { // normal
      if (node.recipe.normal.ingredients) ingredients = node.recipe.normal.ingredients;
    } else { // basic
      if (node.recipe.ingredients) ingredients = node.recipe.ingredients;
    }
    return ingredients;
  }

  private getQuantityPerCraft(recipe): number {
    let quantityPerCraft = 1;
    if (!recipe) return quantityPerCraft;
    if (recipe.result_count) quantityPerCraft = recipe.result_count;
    //console.log('-', quantityPerCraft);
    if (recipe.results) {
      recipe.results.forEach(result => {
        if (result.name == recipe.name) {
          quantityPerCraft = result.amount;
        }
      });
    }
    //console.log('--', quantityPerCraft);
    return quantityPerCraft;
  }

  private getCraftingCategory(recipe): string {
    let category = 'unknown';
    if (!recipe) return category;
    if (recipe.category) {
      category = recipe.category;
    } else {
      category = 'crafting';
    }
    return category;
  }

  private getCraftingTime(recipe): number {
    let craftingTime = .5;
    if (!recipe) return craftingTime;
    if (recipe.expensive && this.useExpensiveRecipes$.value) { // expensive
      if (recipe.expensive.energy_required) craftingTime = recipe.expensive.energy_required;
      //console.log('using expensive recipe', this.recipe.name);
    } else if (recipe.normal) { // normal
      if (recipe.normal.energy_required) craftingTime = recipe.normal.energy_required;
    } else { // basic
      if (recipe.energy_required) craftingTime = recipe.energy_required;
    }
    return craftingTime;
  }

  private getCraftingMachines(craftingCategory: string, numIngredients): any[]{
    let machines = this.dataService.getAssemblingMachinesByCategory(craftingCategory, numIngredients);
    return machines;
  }

}