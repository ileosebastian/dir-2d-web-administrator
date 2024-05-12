import { Component, OnInit, ViewChild, ElementRef, inject, Renderer2, Input, WritableSignal, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { PlaneEditorController } from '../../../../../core/plane-editor/infraestructure/plane-editor.controller';

import { BlockRole, Box, Place, Plane, Sprite, Waypoint } from '../../../../../core/plane-editor/domain/map.domain';
import { Category } from '../../../../editor/models/category.interface';
import { Router } from '@angular/router';
import { UUID } from 'src/app/core/shared/models/core.types';


@Component({
  selector: 'app-playground-editor',
  templateUrl: './playground-editor.component.html',
  styleUrls: ['./playground-editor.component.scss'],
  standalone: true
})
export class PlaygroundEditorComponent implements OnInit, AfterViewInit {

  @Input() isAndUpdate: boolean = false;
  @Input() currentPlane!: Plane;
  @Input() typePlaceCategory!: Category;

  @Output() emittCurrentPlane = new EventEmitter<Plane>;
  @Output() emittQuantity = new EventEmitter<number>;
  @Output() emittPlanes = new EventEmitter<number[]>;

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('guide') guide!: ElementRef<HTMLElement>;

  private rowsEditor!: number;
  buildingId!: UUID;

  private planeController = inject(PlaneEditorController);
  private rederer = inject(Renderer2);
  private route = inject(Router);

  // for places 
  @Output() emittShowPlaceInfo = new EventEmitter<boolean>;
  sprite!: Sprite;
  @Output() emittSprite = new EventEmitter<Sprite>;
  place!: Place;
  @Output() emittPlace = new EventEmitter<Place>;

  // for waypoint
  @Output() emittShowWaypointInfo = new EventEmitter<boolean>;
  waypoint!: Waypoint;
  @Output() emittWaypoint = new EventEmitter<Waypoint>;

  box!: Box;
  @Output() emittBox = new EventEmitter<Box>;

  ngOnInit() {

  }

  async ngAfterViewInit() {
    // CREATE AND SETUP NEW EDITOR FOR 'PB'
    const canvas = this.canvas.nativeElement;
    this.planeController.setCanvas = canvas;


    await this.setCreationStage();

  }

  private async setUpdateStage() {
    const id = this.route.url.split('/').pop();
    if (id) this.buildingId = id as UUID;

    await this.planeController.getTotalMap(this.buildingId);
  }

  private async setCreationStage() {
    // check if there are already saved plans
    const plans = await this.planeController.restorePlanes(1);

    if (plans.length > 0) { // if are planes stored in local storage
      const tempPlanes: number[] = [];
      plans.forEach(plane => {
        tempPlanes.push(plane.floor);
      });

      this.currentPlane = await this.planeController.getPlaneByFloor(1);

      this.emittQuantity.emit(tempPlanes.length);
      this.emittPlanes.emit(tempPlanes);
    } else {
      this.currentPlane = await this.planeController.createNewPlane(1);

      this.emittQuantity.emit(1);
      this.emittPlanes.emit([1]);
    }

    this.emittCurrentPlane.emit(this.currentPlane);
    this.rowsEditor = this.currentPlane.rows; // this value is the same for all editors
    this.planeController.generatePlane(this.currentPlane, true);

    // SETUP GUIDE FOR UI
    this.generateGuide();
  }

  async handleCanvasClick(event: MouseEvent) {
    // Normalize coordinates
    const coordinates = this.planeController.normalizeCoordinates(event, this.currentPlane);
    let type: string;
    try {
      type = await this.planeController.getIdentifier();
    } catch (err) {
      console.error("=>", err);
      type = '';
    }

    // draw in canvas
    if (coordinates) {
      const selected = this.planeController.findBoxContainer(coordinates.x, coordinates.y, this.currentPlane);
      console.log(type, selected);
      if (selected.boxSelected.type !== 'ground' && (!['block', 'invisible_lock_down', 'invisible_lock_up'].includes(type) || type.length === 0)) { // si no es un ground o un block de tipo obstacle, sigue
        if (selected.content === 'ground') return;
        if (selected.content.valueOf().hasOwnProperty('pointType')) {
          this.waypoint = selected.content as Waypoint;
          this.box = selected.boxSelected;
          this.setWaypoint(this.box, this.waypoint);
          return;
        }
        if (selected.content.valueOf().hasOwnProperty('source')) { // a sprite
          this.box = selected.boxSelected;
          this.sprite = this.box.contain as Sprite;
          const result = this.planeController.getPlace(this.sprite.placeId);
          if (result) {
            this.place = result;
            this.setPlace(this.box, this.place, this.sprite);
          }
          return;
        }
      } else if (type.length > 0) { // add new BOX
        // new Block
        if (['block', 'invisible_lock_down', 'invisible_lock_up'].includes(type)) {
          console.log("crea nuevo tipo de bloque", type);
          const colorInput = document.getElementById('blockColor');
          type = type === 'block' ? 'obstacle' : type;
          if (colorInput instanceof HTMLInputElement) {
            this.box = this.planeController.addBlock(
                coordinates.x, coordinates.y,
                colorInput.value, this.currentPlane, type as BlockRole);
          } else {
            this.box = this.planeController.addBlock(
                coordinates.x, coordinates.y, '', 
                this.currentPlane, type as BlockRole);
          }
          return;
        }
        // new WayPoint
        if (['waypoint'].includes(type)) {
          this.box = this.planeController.addWayPoint(coordinates.x, coordinates.y, this.currentPlane);

          // Show for more fiels
          this.waypoint = <Waypoint>this.box.contain;
          this.setWaypoint(this.box, this.waypoint);
          return;
        }
        // new Place
        this.box = await this.planeController.addSprite(coordinates.x, coordinates.y, type, this.typePlaceCategory, this.currentPlane);
        this.sprite = this.box.contain as Sprite;
        const result = this.planeController.getPlace(this.sprite.placeId);
        if (result) {
          this.place = result;
          this.setPlace(this.box, this.place, this.sprite);
        }
      }
    }
  }

  private setWaypoint(box: Box, waypoint: Waypoint) {
    this.emittBox.emit(box);
    this.emittWaypoint.emit(waypoint);

    this.emittShowWaypointInfo.emit(true);
    this.emittShowPlaceInfo.emit(false);
  }

  private setPlace(box: Box, place: Place, sprite: Sprite) {
    this.emittBox.emit(box);
    this.emittPlace.emit(place);
    this.emittSprite.emit(sprite);

    this.emittShowPlaceInfo.emit(true);
    this.emittShowWaypointInfo.emit(false);
  }

  private generateGuide(): void {
    const guide = this.guide.nativeElement;

    this.rederer.setStyle(guide, 'width', `${this.canvas.nativeElement.width}px`);
    this.rederer.setStyle(guide, 'height', `${this.canvas.nativeElement.height}px`);
    this.rederer.setStyle(guide, 'grid-template-columns', `repeat(${this.rowsEditor * 2}, 0.1fr)`);
    this.rederer.setStyle(guide, 'grid-template-rows', `repeat(${this.rowsEditor}, 0.1fr)`);

    [...Array(this.rowsEditor ** 2)].forEach(() =>
      guide.insertAdjacentHTML("beforeend", `
        <div style="border: 0.1px solid rgba(0, 0, 0, 0.1);"></div>
        <div style="border: 0.1px solid rgba(0, 0, 0, 0.1);"></div>`)
    );
  }

}
