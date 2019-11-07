import {auth, twitter_login_config} from '../config/firebase_config'
import {NativeModules} from 'react-native'
import _database from './Firebase_database'
import _storage from './Firebase_storage'

 class Twitter_auth{
    constructor(props) {

      }
      
    _login = async() => {
        try {
            const { RNTwitterSignIn } = NativeModules;
            await RNTwitterSignIn.init(twitter_login_config.TWITTER_CONSUMER_KEY, twitter_login_config.TWITTER_CONSUMER_SECRET);
        
            // also includes: name, userID & userName
            const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn();    
        
            const credential = auth.TwitterAuthProvider.credential(authToken, authTokenSecret);
        
            const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
        
            console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
          } catch (e) {
            console.error(e);
          }
    }
}

export default twitter_auth = new Twitter_auth();