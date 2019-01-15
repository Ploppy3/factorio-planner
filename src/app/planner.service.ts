import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { VirtualNode } from './virtual-node';
import { environment } from 'environments/environment';

@Injectable()
export class PlannerService {

  public useExpensiveRecipes$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public timeFactor$: BehaviorSubject<number> = new BehaviorSubject(1); // 1 || 1/60 || 1/3600 (set set by output node)
  public sharedResources: {} = {};

  public virtualTree = {};
  private virtualTreePointer = 0;

  constructor(
    private dataService: DataService,
  ) {
    if (!environment.production) { console.log('constructor'); }
    this.useExpensiveRecipes$.subscribe();
    this.timeFactor$.subscribe();
  }

  public addSharedResource(name: string, throughput: number) {
    if (name === 'Item') { return; }
    if (this.sharedResources[name]) {
      this.sharedResources[name] += throughput;
    } else {
      this.sharedResources[name] = throughput;
    }
    // console.log(this.sharedResources);
  }

  public resetSharedRessources() {
    this.sharedResources = [];
  }

  public createInMemoryTree(recipeName: string): number {
    console.log('creating in memory tree for', recipeName);
    this.virtualTree = {};
    const rootNode = new VirtualNode(this, recipeName);
    const rootId = this.virtualTreePointer;
    this.processNode(rootNode);
    this.calculateAllNodes();
  }

  public calculateAllNodes() {
    for (const key in this.virtualTree) {
      if (this.virtualTree.hasOwnProperty(key)) {
        const node = this.virtualTree[key];
        node.calculate();
      }
    }
  }

  private getRecipe(name: string) {
    return this.dataService.recipesObject[name] ? this.dataService.recipesObject[name] : null;
  }

  private processNode(node: VirtualNode, parentId?: number): number {
    node.recipe = this.getRecipe(node.name);
    node.quantityPerCraft = this.getQuantityPerCraft(node.recipe);
    node.category = this.getCraftingCategory(node.recipe);
    node.craftingTime = this.getCraftingTime(node.recipe);
    this.virtualTree[this.virtualTreePointer] = node;
    const nodeId = this.virtualTreePointer;
    this.virtualTreePointer++;
    // console.log('node', node.name, 'id', nodeId);
    const ingredients = this.getIngredients(node);
    // console.log('ingredients', ingredients);
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
    if (!node.recipe) { return []; }
    let ingredients: any[] = [];
    if (node.recipe.expensive && this.useExpensiveRecipes$.value) { // expensive
      if (node.recipe.expensive.ingredients) { ingredients = node.recipe.expensive.ingredients; }
      // console.log('using expensive recipe', node.recipe.name, ingredients);
    } else if (node.recipe.normal) { // normal
      if (node.recipe.normal.ingredients) { ingredients = node.recipe.normal.ingredients; }
    } else { // basic
      if (node.recipe.ingredients) { ingredients = node.recipe.ingredients; }
    }
    return ingredients;
  }

  private getQuantityPerCraft(recipe): number {

    const quantityPerCraft = 1;
    if (!recipe) { return quantityPerCraft; }
    if (recipe.products) { return recipe.products[0].amount; }
    return quantityPerCraft;
  }

  private getCraftingCategory(recipe): string {

    let category = 'unknown';
    if (!recipe) { return category; }
    if (recipe.category) { category = recipe.category; }
    return category;
  }

  private getCraftingTime(recipe): number {
    let craftingTime = .5;
    if (!recipe) { return craftingTime; }
    if (recipe.energy) { craftingTime = recipe.energy; }
    return craftingTime;
  }

  private getCraftingMachines(craftingCategory: string, numIngredients): any[] {
    const machines = this.dataService.getAssemblingMachinesByCategory(craftingCategory, numIngredients);
    return machines;
  }

}
