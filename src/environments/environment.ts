// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name:'dev',
  firebase: {
    config :{
      apiKey: "AIzaSyBBw_PHD2nfnjWsqCysEdIMPnjh507Qq08",
      authDomain: "angular-test-6c2ba.firebaseapp.com",
      projectId: "angular-test-6c2ba",
      storageBucket: "angular-test-6c2ba.appspot.com",
      messagingSenderId: "198825047659",
      appId: "1:198825047659:web:247117caa8d461370aa32e"
    }
  },
  url:'http://localhost:5555/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
