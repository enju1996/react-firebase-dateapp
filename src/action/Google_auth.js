import {LoginManager, AccessToken, FBSDK, GraphRequest,GraphRequestManager} from 'react-native-fbsdk'
import {firebase, google_login_config} from '../config/firebase_config'
import _database from '../action/Firebase_database'
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

 class Google_auth{
    constructor(props) {

      }
    
    _login =async()=>{
        try {
            // add any configuration settings here:
            await GoogleSignin.configure(google_login_config);
        
            const data = await GoogleSignin.signIn();
            console.log(JSON.stringify(data))
            // create a new firebase credential with the token
            const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
            // login with credential
            await firebase.auth().signInWithCredential(credential)
            .then(async(data)=>{
                let user = data.user;
                let isUser = await _database._check_user(user.uid)
                  if(!isUser){  //처음 로그인 한 사람일 경우
                    await _database._init_user_data(user.displayName, user.photoURL, '', user.uid); 
                }
                console.log('구글 ' + user.displayName +' ' + user.photoURL+' ' +  user.uid);
                
              })
              .catch(()=>{
                return Promise.reject();
              })
              return Promise.resolve();
             
            } catch (e) {
              console.error(e);
          }
    }
 }

export default google_auth = new Google_auth();