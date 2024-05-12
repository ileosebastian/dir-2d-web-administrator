import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfessorsSearchBarComponent } from '../../../../views/shared/components/professors-search-bar/professors-search-bar.component';


@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    ProfessorsSearchBarComponent
  ]
})
export class HeaderSearchComponent  implements OnInit {

  @Input() domainName: string = "Domain";
  @Input() domainToCreate: string = "create";
  @Input() featureRoute: string = "";
  route: string = `../${this.featureRoute}`

  @Output() emmitSearchText = new EventEmitter<string>()

  constructor() { }

  ngOnInit() { 
    this.route = `../${this.featureRoute}`;
  }

  // emits text to search items
  search(text: string) {
    // const itemByNameText: string = event.target.value.toLowerCase(); 
    const itemByNameText: string = text.toLowerCase(); 

    this.emmitSearchText.emit( itemByNameText );
  }

}