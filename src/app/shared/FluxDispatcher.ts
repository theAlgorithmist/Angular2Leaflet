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
 * A minmimal implementation of Flux-style dispatcher that serves as a reusable mediator between a generic component and a model instance that implements the 
 * IReduxModel interface.  Assign a model reference first and then add components as subscribers.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 // platform imports
 import { Injectable } from '@angular/core';

 // rxjs
 import { Subject     } from 'rxjs/Subject';
 import { IReduxModel } from './interfaces/IReduxModel';

 @Injectable()
 export class FluxDispatcher
 {
   // singleton instance
   private static _instance: FluxDispatcher;

   // direct reference to a redux-style model
   protected _model: IReduxModel;

   // cache subscribers until a model reference is set
   protected _subscribers: Array<Subject<any>>;

  /**
   * Construct a new FluxDispatcher
   *
   * @return nothing
   */
   constructor()
   {
     // this is not strictly necessary if the dispatcher is used only via DI; it allows reusability outside the Angular inversion of control framework
     if (FluxDispatcher._instance instanceof FluxDispatcher) 
       return FluxDispatcher._instance;

     this._subscribers = new Array<Subject<any>>();

     FluxDispatcher._instance = this;
   }

  /**
   * Assign a model to link up with this dispatcher
   *
   * @param m: IReduxModel Reference to a model that implements the IReduxModel interface
   *
   * @return nothing Any actions dispatched by a FluxComponent will be sent to this model
   */
   public set model( m: IReduxModel )
   {
     if (m)
     {
       this._model = m;

       // model assignment is allowed to be lazy; i.e. subscribers may be set before the model reference
       if (this._subscribers.length > 0)
       {
         this._subscribers.map( (subject: Subject<any>): void => {this._model.subscribe(subject)} );
         this._subscribers.length = 0;
       }
     }
   }

  /**
   * Subscribe to updates
   *
   * @param subject: Subject<any> This Subject will be subscribed to future updates from the asigned model 
   * 
   * @return nothing
   */
   public subscribe( subject: Subject<any> ): void
   {
     if (subject)
     {
       if (this._model)
         this._model.subscribe(subject);
       else
         this._subscribers.push(subject);  // defer subscription until model reference is assigned
     }
   }

  /**
   * Unsubscribe to updates
   *
   * @param subject: Subject<any> This Subject will be unsubscribed to future updates from the asigned model 
   * 
   * @return nothing
   */
   public unsubscribe( subject: Subject<any> ): void
   {
     if (this._model)
     {
       this._model.unsubscribe(subject);
     }
   }

   public dispatchAction( action: number, payload: Object ): void
   {
     if (this._model && !isNaN(action))
     {
       this._model.dispatchAction(action, payload);
     }
   }
 }