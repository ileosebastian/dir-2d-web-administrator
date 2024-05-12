import { Component, OnInit, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Building } from 'src/app/core/plane-editor/domain/map.domain';


@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html',
  styleUrls: ['./map-card.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class MapCardComponent implements OnInit {

  @Input() building!: Building;

  private router = inject(Router);
  // @Input() title: string = "Humanistica Uno";
  // @Input() subtitle: string = "Facultad de ciencias humanisticas y sociales";

  ngOnInit() { }

  // TODO: redirect to Edit map
  reditectToEditPage(buildingId: string) {
    this.router.navigate(['/home/edit/map', buildingId], { replaceUrl: true });
  }

}
