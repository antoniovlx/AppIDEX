import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'preguntas'
})
export class PreguntasPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
