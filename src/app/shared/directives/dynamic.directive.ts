import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamic]'
})
export class DynamicDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}