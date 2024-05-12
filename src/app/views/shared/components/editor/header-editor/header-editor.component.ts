import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header-editor',
  templateUrl: './header-editor.component.html',
  styleUrls: ['./header-editor.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class HeaderEditorComponent  implements OnInit {

  @Input() backTo!: string;
  @Input() title!: string;

  constructor() { }

  ngOnInit() {}

}
