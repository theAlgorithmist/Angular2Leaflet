
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
 * Typescript Math Toolkit: A generic location class that may be used in a variety of mapping applications.
 *
 * Note: This is an alpha release - the 'address' property will be deprecated in the future in favor of a more general Address class
 *
 * @author Jim Armstrong (www.algorithmist.net)
 * 
 * @version 1.0
 */

export class TSMT$Location 
{
  // constants
  protected static TO_MILES: number   = 0.621371;       // km to miles
  protected static DEG_TO_RAD: number = 0.01745329251;  // PI/180.0;
  protected static RADIUS_KM: number  = 6378.5;         // radius of earth in km.

  // public properties
  public id: string;           // an optional string identifier that may be associated with this location
  public isError: boolean;     // flag an error associated with attempting to set this location
  public info: string;         // supplemental information associated with an error condition or other setting of this location

  // internal
  protected _lat: number;      // latitude of this location in degrees (in range -90 to 90, south of equator is negative)
  protected _long: number;     // longitude of this location in degrees (in range -180 t0 180, west of prime meridian is negative)
  protected _address: string;  // an optional, physical address associated with this location
  protected _data: Object;     // optional data for this location as name-value pairs
  
 /**
  * Construct a new Location
  *
  * @return nothing A default location at (0,0) with a blank address is created
  */
  constructor()
  {
    this.clear();
  }

 /**
  * Access the latitude of this location
  *
  * @return number Latitude of current location in degrees in the range [-90,90]
  */
  public get latitude(): number
  {
    return this._lat;
  }

 /**
  * Access the longitude of this location
  *
  * @return number Longitude of current location in degress in the range [-180, 180]
  */
  public get longitude(): number
  {
    return this._long;
  }

 /**
  * Access the address of this location
  *
  * @return string Current address (note that this will be deprecated in the future)
  */
  public get address(): string
  {
    return this._address;
  }

 /**
  * Access a named data item associated with this location
  *
  * @param name: string Name of data item
  *
  * @return any Data value associated with the named item or null if no such named data item exists
  */
  public getData(name: string): any
  {
    if (this._data.hasOwnProperty(name))
      return this._data[name];
  }

 /**
  * Assign the latitude of this location
  *
  * @param value: number Latitude value in degrees that should be in the range [-90,90]
  *
  * @return nothing Assigns the input latitude to this location as long as the value is valid
  */
  public set latitude(value: number)
  {
    if (!isNaN(value) && isFinite(value) && value >= -90 && value <= 90)
      this._lat = value;
  }

 /**
  * Assign the longitude of this location
  *
  * @param value: number Longitude value in degrees that should be in the range [-180,180]
  *
  * @return nothing Assigns the input longitude to this location as long as the value is valid
  */
  public set longitude(value: number)
  {
    if (!isNaN(value) && isFinite(value) && value >= -180 && value <= 180)
      this._long = value;
  }

 /**
  * Assign the address of this location
  *
  * @param value: string Address string such as 1234 Somewhere Lane, Anywhere, YourState, 12345 USA
  *
  * @return nothing Assigns the input address even if the string is blank; this will be replaced in the future by a more general address structure
  */
  public set address(value: string)
  {
    this._address = value;
  }

 /**
  * Assign a named data attribute to this location
  *
  * @param name: string Name of the data attribute
  *
  * @param value: any Value of the data attribute
  *
  * @return nothing Assigns the name-value pair to the internal data associated with this location as long as the name is not a null or single-blank string
  */
  public setData(name: string, value: any)
  {
    if (name != "" && name != " ")
      this._data[name] = value;
  }

 /**
  * Clear this location
  *
  * @return nothing Clears all data associated with this location - this is equivalent to constructing a new Location
  */
  public clear(): void
  {
    this.id       = "";
    this.info     = "";
    this.isError  = false;
    this._lat     = 0;
    this._long    = 0;

    this._address = "";
    this._data    = new Object();
  }

 /**
  * Clone of this location
  *
  * @return TSMT$Location A clone of the current Location
  */
  public clone(): TSMT$Location
  {
    let location: TSMT$Location = new TSMT$Location();

    location.id        = this.id;
    location.isError   = this.isError;
    location.info      = this.info;
    location.address   = this._address;
    location.latitude  = this.latitude;
    location.longitude = this.longitude;

    let keys:Array<string> = Object.keys(this._data);
    keys.map( (name: string): void => {location.setData(name, this._data[name])} );

    return location;
  }

 /**
  * Return the great-circle distance between this and another location specified by (lat, long)
  *
  * @param lat: number Latitude value in degrees that should be in the range [-90,90]
  *
  * @param long: number Longitude value in degrees that should be in the range [-180, 180]
  *
  * @param toMiles: boolean True if the distance is returned in miles
  * @default false
  *
  * @return number Great-circle distance between the current Location and the input (lat, long) in KM unless the toMiles parameter is set to true
  */
  public gcd(lat: number, long: number, toMiles: boolean=false): number
  {
    let lat1: number  = this.latitude*TSMT$Location.DEG_TO_RAD;
    let lat2: number  = lat*TSMT$Location.DEG_TO_RAD;
    let long1: number = this.longitude*TSMT$Location.DEG_TO_RAD;
    let long2: number = long*TSMT$Location.DEG_TO_RAD;
    let dlat: number  = Math.abs(lat2 - lat1); 
    let dlon: number  = Math.abs(long2 - long1);
    let sLat: number  = Math.sin(dlat*0.5);
    let sLong: number = Math.sin(dlon*0.5);
    let a: number     = sLat*sLat + Math.cos(lat1)*Math.cos(lat2)*sLong*sLong;
    let c: number     = 2*Math.asin(Math.min(1.0,Math.sqrt(a)));

    let result: number = TSMT$Location.RADIUS_KM*c;  // result in km

    return toMiles ? result*TSMT$Location.TO_MILES : result;
  }
}