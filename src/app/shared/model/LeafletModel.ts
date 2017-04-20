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
 * LeafletModel - This is the global store for the Leaflet example application.  Data placed into the store is derived from the Angular 2
 * Leaflet starter, https://github.com/haoliangyu/angular2-leaflet-starter
 *
 * The model is Redux-style in the sense that it maintains immutability, accepts action dispatch with type and payload,
 * internally reduces the model as needed, and then sends copies of relevant slices of the model to subscribers. 
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 // platform imports
 import { Injectable } from '@angular/core';

 // interfaces
 import { IReduxModel } from '../interfaces/IReduxModel';

 // actions
 import { BasicActions } from '../actions/BasicActions';

 // services - adding an actual service layer to the application is left as an exercise
 import { LocationService } from '../services/location.service';
 import { Geocode         } from '../services/Geocode';

 // typescript math toolkit
 import { TSMT$Location } from '../Location';

 // leaflet
 import * as L from 'leaflet';

 // rxjs
 import { Subject    } from 'rxjs/Subject';
 import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class LeafletModel implements IReduxModel
 {
   // singleton instance; this is not necessary, but allows the model to be used outside the Angular DI system
   private static _instance: LeafletModel;

   // reference to actual store - this remains private to support compile-time immutability
   private _store: Object = new Object();

   // current action
   private _action: number;

   // has airport data been fetched?
   private _airportsFetched: boolean = false;

   // subscribers to model updates
   private _subscribers:Array<Subject<any>>;

  /**
   * Construct a new Leaflet model
   *
   * @param geocoder: Geocode Injected geocoding service (convert string address to TSMT$Location)
   *
   * @param locationService: LocationServide Injected location service (get current location based on IP address)
   */
   constructor(private _geocoder: Geocode, private _locationService: LocationService) 
   {
     if (LeafletModel._instance instanceof LeafletModel) 
       return LeafletModel._instance;
     
     // define the structure of the global application store
     this._store['location'] = new TSMT$Location();

     this._store['tileData'] = {
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
     };

     this._store['mapParams'] = {
       zoomControl: true
       , center: L.latLng(32.9866, -96.9271)  // I live in Carrollton, TX
       , zoom: 12 
       , minZoom: 4
       , maxZoom: 19
     };

     // list of subscribers for updates to the store
     this._subscribers = new Array<Subject<any>>();

     // current action
     this._action = BasicActions.NONE;

     // singleton instance
     LeafletModel._instance = this;
   }

  /**
   * Subscribe a new Subject to the model
   *
   * @param subject: Subject<any> A Subject with at least an 'next' handler
   *
   * @return Nothing - The Subject is added to the subscriber list
   */
   public subscribe( subject: Subject<any> ): void
   {
     // for a full-on, production app, would want to make this test tighter
     if (subject)
       this._subscribers.push(subject);
   }

  /**
   * Unsubscribe an existing Subject from the model
   *
   * @param subject: Subject<any> Existing subscribed Subject
   *
   * @return Nothing - If found, the Subject is removed from the subscriber list (typically executed when a component is destructed)
   */
   public unsubscribe( subject: Subject<any> ): void
   {
     // for a full-on, production app, would want to make this test tighter
     if (subject)
     {
       let len: number = this._subscribers.length;
       let i: number;

       for (i=0; i<len; ++i)
       {
         if (this._subscribers[i] === subject)
         {
           this._subscribers.splice(i,1);
           break;
         }
       }
     }
   }

  /**
   * Dispatch an Action to the model, which causes the model to be changed - application of a reducer - and then a slice of the new model
   * is sent to all subscribers.  This includes the action that caused the reduction.  A copy of model data is always sent to perserve
   * immutability.
   *
   * @param action: number Action type
   *
   * @param payload: Object (optional) Payload for the action, which may be used by a reducer
   *
   * @return Nothing - All subscribers are notified after the model is updated
   */
   public dispatchAction(action: number, payload: Object=null): void
   {
     let validAction: Boolean = false;
     let data:Object;

     this._action = action;
     switch (this._action)
     {
       case BasicActions.GET_MAP_PARAMS:
         // params are hardcoded at construction in this demo
         this._store['action'] = this._action;
         validAction           = true;
       break;

       case BasicActions.CURRENT_LOCATION:
         // note that you could cache the current location (once fetched) and maintain that in the global store as well if you expect this path to be executed
         // many times.
         let location: TSMT$Location = <TSMT$Location> this._store['location'];

         this._store['action'] = this._action;
        
         this._locationService.getLocation()
                              .subscribe( data  => this.__onCurrentLocation(data),
                                          error => this.__onLocationError() );

         validAction = false;    // wait until service data is completely processed before responding
       break;
       
       case BasicActions.ADDRESS:
         if (payload.hasOwnProperty('address'))
         {
           this._geocoder.toLocation(payload['address'])
                         .subscribe( data  => this.__onCurrentLocation(data),    // same method does double-duty
                                     error => this.__onAddressError() );

           this._store['action'] = this._action;
           validAction           = false;    // wait until service data is completely processed before responding
         }
       break;

       case BasicActions.ALL:
         // to be implemented as an exercise
       break;
     }

     // immediately update all subscribers?
     if (validAction)
       this.__updateSubscribers();
   }

   private __updateSubscribers(): void
   {
     // send copy of the current store to subscribers, which includes most recent action - you could recopy for each subscriber or have the
     // subscribers make a copy of the required slice of the store.  Former is more robust, latter is more efficient.  Try it both ways;
     // the global store is immutable in either case.

     let location: TSMT$Location = <TSMT$Location> this._store['location'];
     let store: Object           = JSON.parse( JSON.stringify(this._store) );  // this isn't as robust as you may have been led to believe
     store['location']           = location.clone();                           // this is the hack

     this._subscribers.map( (s:Subject<any>) => s.next(store) );
   }

   // update the location in the global store and broacast to subscribers
   private __onCurrentLocation(data: any): void
   {
     if (data)
     {
       if (data instanceof TSMT$Location)
       {
         let location = (<TSMT$Location> data).clone();

         if (location.isError)
           this.__onAddressError();
         else
         {
           this._store['location'] = location;

           this.__updateSubscribers();
         }
       }
     }
   }

   // error handlers broken into separate methods to allow future flexibility to add customized handling based on error type; otherwise, these could
   // be folded into one method with the action as an argument
   private __onLocationError(): void
   {
     // for purposes of error information, we can 'fake' a global store as only the action is required for subsequent action
     this._subscribers.map( (s:Subject<any>) => s.next({'action': BasicActions.LOCATION_ERROR}) );
   }
   
   private __onAddressError(): void
   {
     this._subscribers.map( (s:Subject<any>) => s.next({'action': BasicActions.ADDRESS_ERROR}) );
   }
 }
