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
import { Component
       , Input 
       } from '@angular/core';

@Component({
  selector: 'loading',

  templateUrl: 'loading.component.html',

  styleUrls: ['loading.component.css']
})

/**
 * A very simple 'loading' component with text that may be set as an html attribute 
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
 export class LoadingComponent
 {
   @Input() loadingText: string;    // loading text

 /**
   * Construct the loading component
   *
   * @return Nothing
   */
   constructor()
   {
     // empty
   }
 }
