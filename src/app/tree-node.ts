import { PlannerService } from './planner.service';

export class TreeNode {

  public recipe: any;
  public childsIds: number[] = [];
  public idParent: number;
  public recipeRequest = 1;
  public outputRate = 1;
  public quantityPerCraft = 1;
  public craftingTime = .5;
  public numberMachines = 0;
  public craftingMachine = null;
  public category = 'unknown';
  public machines = [];
  public showOptions = false;

  constructor(private plannerService: PlannerService, public name: string) { }

  public calculate() {
    // console.log('calculating treenode');
    const parent = this.plannerService.virtualTree[this.idParent] || null;
    if (parent) {
      this.outputRate = parent.outputRate / parent.quantityPerCraft * this.recipeRequest;
    } else {
      this.outputRate = 1 / 1 * this.recipeRequest;
    }
    // console.log('calculate', this.name, this.outputRate);
    if (this.craftingMachine) {
      this.numberMachines = this.outputRate / this.quantityPerCraft / (this.craftingMachine.crafting_speed / this.craftingTime);
    }
  }

  public getSharedResources() {
    this.plannerService.addSharedResource(this.name, this.outputRate * this.plannerService.timeFactor$.value);
  }

}