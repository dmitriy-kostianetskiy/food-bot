import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appGridCellForOf]'
})
export class GridCellForOfDirective {
  @Input('appGridCellForOf') cells;

  constructor() { }

}

@Directive({
  selector: '[appGridCellFor]'
})
export class GridCellForDirective {


  constructor() { }

}
