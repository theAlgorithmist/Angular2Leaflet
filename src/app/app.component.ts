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
import {  Component 
        , OnInit
        , AfterViewInit
        , ViewChild
        , ChangeDetectorRef
       } from '@angular/core';

// leaflet map and loading components
import { LeafletMap       } from './LeafletMap.component';
import { LoadingComponent } from './loading/loading.component';

// base Flux component
import { FluxComponent } from './shared/flux.component';

// Global store and dispatcher
import { LeafletModel   } from './shared/model/LeafletModel';
import { FluxDispatcher } from './shared/FluxDispatcher';

// actions
import { BasicActions } from './shared/actions/BasicActions';

// Typescript Math Toolkit Location
import { TSMT$Location } from './shared/Location';

// rxjs imports
import { Subject      } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',

  templateUrl: 'app.component.html',

  styleUrls: ['app.component.css']
})

/**
 * Root component for Leaflet demo 
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
 export class AppComponent extends FluxComponent implements OnInit, AfterViewInit
 {
   protected _loading: boolean = true;    // true if content is being loaded

   // access the leaflet map
   @ViewChild(LeafletMap) _leafletMap: LeafletMap;

 /**
   * Construct the main app component
   *
   * @return Nothing
   */
   constructor(private _m: LeafletModel, private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef)
   {
     super(_d);

     // since there is no formal framework that ties the dispatcher and global store together, this step is done manually.  you can start to appreciate what
     // ngrx/store does under the hood :)
     _d.model = _m;
   }

  /**
   * Component lifecycle - on init
   *
   * @return nothing - reserved for future use
   */
   public ngOnInit()
   {
     // for future use
   }

  /**
   * Component lifecycle - after view init
   *
   * @return nothing - dispatch action to request map paraams
   */
   public ngAfterViewInit()
   {
     this._d.dispatchAction(BasicActions.GET_MAP_PARAMS, null);
   }

   // update the component based on a new state of the global store
   protected __onModelUpdate(data: Object): void
   {
     let location: TSMT$Location;

     switch (data['action'])
     {
       case BasicActions.GET_MAP_PARAMS:
         this._leafletMap.initialize( data['mapParams'], data['tileData'] );
       break;

       case BasicActions.CURRENT_LOCATION:
       case BasicActions.ADDRESS:
         location = <TSMT$Location> data['location'];

         this._leafletMap.toLocation(location.latitude, location.longitude);
       break;
     }
   }

   protected __onLayerAdded(payload: any): void
   {
     // if layer was added while loading in progress, this is an indication of the initial (application) load
     if (this._loading)
     {
       this._loading = false;

       // force change detection since we changed a bound property after the normal check cycle and outside anything that would trigger a 
       // CD cycle - this will eliminate the error you get when running in dev mode and provide another example of how this process works.
       this._chgDetector.detectChanges();
     }
   }
 }
