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
import { Injectable     } from '@angular/core';
import { Http, Response } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// TSMT Location
import { TSMT$Location } from '../Location';

/**
 * A basic service to return current location based on IP address
 */

@Injectable()
export class LocationService 
{
 /**
  * Construct a new location service
  *
  * @param _http: Http Injected Http instance from the platform
  */
  constructor(protected _http: Http) 
  {
    // empty
  }

 /**
  * Retrieve the current location of the user based on ip address
  *
  * @param _url: string URL of external service
  *
  * @return Observable<TSMT$Location>
  */
  public getLocation(): Observable<TSMT$Location>
  {
    return this._http
           .get("http://ipv4.myexternalip.com/json")
           .map(res => res.json().ip)
           .mergeMap(ip => this._http.get("http://freegeoip.net/json/" + ip))
           .map((res: Response) => res.json())
           .map(result => {
             let location = new TSMT$Location();

             location.address   = result.city + ", " + result.region_code + " " + result.zip_code + ", " + result.country_code;
             location.latitude  = result.latitude;
             location.longitude = result.longitude;

             return location;
           });
  }
}
