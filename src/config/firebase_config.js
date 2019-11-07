
import firebase from 'firebase';
import OAuthManager from 'react-native-oauth';
import Geocoder from 'react-native-geocoding';

const firebaseConfig = {
    /* firebase api key 추가*/
};

const google_login_config={
    /* google_login_config 추가*/
 offlineAccess: true
}

const twitter_login_config = {
    /* twitter_login_config 추가*/
};

  
Geocoder.init( /* Geocoder 추가*/'', {language : "en"}); // set the language

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  //싱글톤으로 생성
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
export {firebase}
export {google_login_config, twitter_login_config}