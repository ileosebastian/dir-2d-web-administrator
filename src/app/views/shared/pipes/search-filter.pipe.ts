import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Professor } from '../../../core/professor/domain/professor.domain';


@Pipe({
  name: 'searchProfessor',
  standalone: true
})
export class SearchProfessorFilterPipe implements PipeTransform {

  transform(
    value: Observable<Professor[]> | null,
    text: string = '',
    // field: string = 'name'
  ): Observable<Professor[]> | null {
    console.log("entra a filtrar", text.length)

    if (text === '' || text.length === 0) return value;
    if (value === null || !value) return value;

    text = text.toLowerCase();
    // field = field ? field : 'name';

    // if text is valid and value it's not empty, filter by professor name de array of professors
    let result = value.pipe(
      map((professor) => {
        return professor.filter(p => p['name'].toLowerCase().includes(text))
      }),
    )

    console.log("pasa el valor", value);
    result.forEach(console.log)

    return result;
  }

}
