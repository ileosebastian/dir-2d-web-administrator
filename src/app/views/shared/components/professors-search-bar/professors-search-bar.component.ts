import { NgIf } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-professors-search-bar',
  templateUrl: './professors-search-bar.component.html',
  styleUrls: ['./professors-search-bar.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf
  ]
})
export class ProfessorsSearchBarComponent  implements OnInit {

  @Input() isHeader!: boolean;
  @Output() emmitSearchText = new EventEmitter<string>();

  ngOnInit() {}

  // emits text to search items
  search(event: any) {
    const itemByNameText: string = event.target.value.toLowerCase(); 

    this.emmitSearchText.emit( itemByNameText );
  }

  cancelSearch(event: any) {
    this.emmitSearchText.emit( '' );
  }

}
