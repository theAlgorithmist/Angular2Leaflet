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

// platform imports
import { Component } from '@angular/core';

// base Flux component & dispatcher
import { FluxComponent } from '../shared/flux.component';
import { FluxDispatcher } from '../shared/FluxDispatcher';

// actions
import { BasicActions } from '../shared/actions/BasicActions';

@Component({
  selector: 'map-navigator',

  templateUrl: 'navigator.component.html',

  styleUrls: ['navigator.component.css']
})

/**
 * MapNavCompoennt - allows a text address to be entered as a place to navigate the map or click a button to move the map to a location based
 * on current IP address
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
 export class MapNavComponent extends FluxComponent
 {
   protected _address: string;                   // the current address on which to center the map

   protected _showNavProgress: boolean = false;  // true if nav progress display is shown
   protected _showLocProgress: boolean = false;  // true if show-location display is shown

   protected _navProgressText: string = "";      // text shown to indicate navigation progress
   protected _locProgressText: string = "";      // text shown to indicate location progress

   protected _clicked: boolean = false;          // protect against multiple submissions

 /**
   * Construct the main app component
   *
   * @param d: FluxDispatcher Inject Flux-style dispatcher used by all FluxComponents
   *
   * @return Nothing
   */
   constructor(private _d: FluxDispatcher)
   {
     super(_d);
   }

   // update the component based on a new state of the global store
   protected __onModelUpdate(data:Object): void
   {
     this._clicked = false;

     switch (data['action'])
     {
       case BasicActions.ADDRESS:
         this._navProgressText = "Map moved to requested address";
         this._clicked         = false;
       break;

       case BasicActions.CURRENT_LOCATION:
         this._locProgressText = "Map moved to current IP location";
         this._clicked         = false;
       break;

       case BasicActions.ADDRESS_ERROR:
         this._navProgressText = "Error geocoding input address. Please enter a valid address.";
         this._clicked         = false;
       break;

       case BasicActions.LOCATION_ERROR:
         this._locProgressText = "Unable to geocode current IP location";
         this._clicked         = false;
       break;
     }
   }
  
   protected __onNavigate(): void
   {
     if (!this._clicked)
     {
       this._clicked         = true;
       this._showLocProgress = false;
       this._showNavProgress = true;

       if (this._address && this._address != "")
       {
         this._navProgressText = "Geocoding requested address, please wait ...";

         this._dispatcher.dispatchAction(BasicActions.ADDRESS, {address:this._address} );
       }
       else
       {
         this._navProgressText = "Please enter an address";
         this._clicked         = false;
       }
     }
     else
       this._locProgressText = "Address fetch in progress, waiting for service return ...";
   }

   protected __onCurrentLocation(): void
   {
     if (!this._clicked)
     {
       this._clicked         = true;
       this._locProgressText = "Fetching location ... please wait";
       this._showLocProgress = true;
       this._showNavProgress = false;

       this._dispatcher.dispatchAction(BasicActions.CURRENT_LOCATION, null);
     }
     else
       this._locProgressText = "Location fetch in progress, waiting for service return ...";
   }
 }
