/** 
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * LeafletMap - A simple leaflet map component
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 import { Component
        , EventEmitter
        , Output
        } from '@angular/core';

 import * as L from 'leaflet';
 import { Map } from 'leaflet';

 @Component({
   selector: 'leaflet-map',

   template: '<div id="leaflet-map-component" class="leafletMapComponent"></div>',

   styles: [`.leafletMapComponent { 
              width: 600px; 
              height: 400px; 
             }`] 
 })

 export class LeafletMap
 {
   protected _map: Map;           // leaflet map

   // Outputs
   @Output() layerAdded  : EventEmitter<any> = new EventEmitter();
   @Output() layerRemoved: EventEmitter<any> = new EventEmitter();

  /**
   * Construct a new Leaflet Map component
   *
   * @return nothing
   */
   constructor()
   {
     // empty
   }

  /**
   * Initialize the map
   *
   * @param params: Object Map params recognized by Leaflet
   *
   * @param tileData: Object containing 'url' and 'attribution' data for the tile layer
   *
   * @return nothing The leaflet map is created, intialized with the supplied parameters, and assigned to the DIV created in the component template.  A single
   * tile layer is addes
   */
   public initialize(params: Object, tileData: Object): void
   {
     // the div id is hardcoded in this example - a future example will show how to make this component more general
     this._map =  L.map('leaflet-map-component', params);

     // events supported in this demo
     this._map.on('layeradd'   , () => {this.__onLayerAdded()}   );
     this._map.on('layerremove', () => {this.__onLayerRemoved()} );

     // add a single tile layer
     L.tileLayer(tileData['url'], { attribution: tileData['attribution'] }).addTo(this._map); 
   }

  /**
   * Move the map to the input location
   *
   * @param lat: number Location latitude in degrees
   *
   * @param long: number Location longitude in degrees
   */
   public toLocation(lat: number, long: number): void
   {
     this._map.panTo( [lat, long]);
   }

   protected __onLayerAdded(): void
   {
     // perform additional logic on layer added here
     this.layerAdded.emit();
   }

   protected __onLayerRemoved(): void
   {
     // perform additional logic on layer removed here
     this.layerRemoved.emit();
   }
 }