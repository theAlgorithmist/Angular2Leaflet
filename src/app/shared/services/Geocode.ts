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
import { Http, Headers, Response } from "@angular/http";
import { Injectable              } from "@angular/core";

// Leaflet
import * as L from 'leaflet';

// TSMT Location
import { TSMT$Location } from "../Location";

// Leaflet
import { LatLngBounds } from "leaflet";

// RXJS
import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import 'rxjs/add/operator/catch';

/**
 * A simple geocoding service based on a similar service provided in the Angular2 leaflet starter, https://github.com/haoliangyu/angular2-leaflet-starter
 *
 */
@Injectable()
export class Geocode
{
  protected _http: Http;  // reference to http service

 /**
  * Construct a new Geocoding service
  *
  * @param http: Http Injected Http service
  *
  * @return nothing
  */
  constructor(http: Http) 
  {
    this._http = http;
  }

/**
 * Convert a string address to a geocoded Location
 * 
 * @param address: string Address that could be as simple as 'Austin, TX'
 *
 * @return Observable<TSMT$Location> Observable that emits a TSMT$Location instance representing the geocoded location of the address or has its 'isError'
 * property set to true if an error occurred.
 */
  public toLocation(address: string): Observable<TSMT$Location>
  {
    let location: TSMT$Location = new TSMT$Location();

    return this._http
           .get("http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address))
           .map(res => res.json())
           .map(result => {
             if (result.status !== "OK")
             {
               console.log( "Error attempting to encode: ", address);
               location.address = address;
               location.isError = true;

               return location;
             }
             else
             {
  
               location.address            = result.results[0].formatted_address;
               location.latitude           = result.results[0].geometry.location.lat;
               location.longitude          = result.results[0].geometry.location.lng;

                let viewPort: any   = result.results[0].geometry.viewport;
                let bounds: Object  = L.latLngBounds(
                  { lat: viewPort.southwest.lat, lng: viewPort.southwest.lng},
                  { lat: viewPort.northeast.lat, lng: viewPort.northeast.lng}
                );

                location.setData('viewBounds', bounds);

                return location;
             }
           });
  }
}