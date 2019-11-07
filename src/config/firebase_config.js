import firebase from 'firebase';
import OAuthManager from 'react-native-oauth';
import Geocoder from 'react-native-geocoding';

const firebaseConfig = {
  apiKey: "AIzaSyA_M2a6tLkLHwXfbdY5JJ9R1Psa7lckmFQ",
  authDomain: "dateapp-web-d6a1c.firebaseapp.com",
  databaseURL: "https://dateapp-web-d6a1c.firebaseio.com",
  projectId: "dateapp-web-d6a1c",
  storageBucket: "dateapp-web-d6a1c.appspot.com",
  messagingSenderId: "301595866183",
  appId: "1:301595866183:web:3c906cfdc7facbcd"
};

const google_login_config={
  scopes: [ 'https://www.googleapis.com/auth/drive.photos.readonly'],
   webClientId:"607443651812-ua5p9tktt8gis09751u9pfc7mro0lepe.apps.googleusercontent.com",
 offlineAccess: true
}

const twitter_login_config = {
  TWITTER_CONSUMER_KEY: 'PLACE_YOUR_TWITTER_CONSUMER_KEY_HERE',
  TWITTER_CONSUMER_SECRET: 'PLACE_YOUR_TWITTER_CONSUMER_SECRET_HERE'
};

  
Geocoder.init("AIzaSyBggxkT_8UuI1vzXR0fKCzKmX7zdwXMsU8", {language : "en"}); // set the language

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  //싱글톤으로 생성
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
export {firebase}
export {google_login_config, twitter_login_config}
    

  