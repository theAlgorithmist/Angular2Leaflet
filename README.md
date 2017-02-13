# Angular 2 and Leaflet

This example is inspired by the Angular 2 Leaflet starter at [https://github.com/haoliangyu/angular2-leaflet-starter] .  That project was correctly described as a 'soup'.  I wanted to take an Angular 2 and Leaflet starter in a different direction, so this example was created as a completely separate project.  Goals for this demo include:


```sh
- Use the Angular2 CLI as the build tool
- Create a complete micro-application as the demonstration environment
- Adhere to concepts from Flux and Redux w/o 3rd party software
- Classes adhere to principles such as single responsibility
- Provide progress and error indication for services
- Illustrate production-quality features such as preventing side effects from repeatedly clicking the same button
- Provide an example of working with the component change detector
- Use the Typescript Math Toolkit Location class for location data
- Only minimal understanding of Leaflet is required
```

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Angular: 2.3.1

Angular CLI: 1.0.0-beta.25.5

## Installation

Installation involves all the usual suspects

  - npm and Angular CLI installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Version

1.0.0

### Building and Running the demo

After installation, _ng-build_ and _ng-serve_ are your friends.  Build production or dev. as you see fit.  localhost:4200 to run the demo, at which point you should see

![Image of Leaflet Demo]
(http://algorithmist.net/image/leafletmap.jpg)


The application provides two means for moving the map.  You may use the current IP address or enter a physical address.  Examples of the latter include complete street, city, state, zip or simply 'Austin, TX'.  Notification of a request in progress is provided after clicking on the 'current location' button or entering an address followed by pressing 'Enter' or clicking the arrow button.  Another notification is provided after the request is complete and the map is panned to the requested location.  Errors are indicated as shown below.

![Image of Map Error]
(http://algorithmist.net/image/maperror.jpg)


The demo has been tested in late-model Chrome on a Mac. 

When it comes to deconstructing the code, don't worry if you have little experience with Leaflet.  If you have made it through the 'Getting Started' guide, then you know enough about Leaflet to work with and expand upon this demo.


## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>
[https://github.com/haoliangyu/angular2-leaflet-starter]: <https://github.com/haoliangyu/angular2-leaflet-starter>


