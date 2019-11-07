import {LoginManager, AccessToken, FBSDK, GraphRequest,GraphRequestManager} from 'react-native-fbsdk'
import {firebase} from '../config/firebase_config'
import _database from '../action/Firebase_database'

 class Facebook_auth{
    constructor(props) {

      }
    
      _init_account =async()=>{   //로그인을 시도하는 계정정보에 대한 관리
        try {
          if (AccessToken.getCurrentAccessToken() != null) {      //이전 로그인 기록이 있을 경우 로그아웃시킴
              LoginManager.logOut();
          }

          const result = await LoginManager.logInWithPermissions([        //사용자에게 권한을 허가받음
            "public_profile",
            "email",
          ]);
    
          if (result.isCancelled) {
            return Promise.reject();
          }
    
          // get the access token
          const data = await AccessToken.getCurrentAccessToken();
    
          if (!data) {
            // handle this however suites the flow of your app
            throw new Error(
              "Something went wrong obtaining the users access token"
            );
          }
    
          // create a new firebase credential with the token
          const credential = firebase.auth.FacebookAuthProvider.credential(       //firebase에 사용자 추가
            data.accessToken
          );

          return Promise.resolve(credential);
        }catch(err){

        }
      }
      
    _login =async(credential)=>{
        try {
          // login with credential
          await firebase
          .auth()
          .signInWithCredential(credential)
          .then(async(data)=>{
            let user = data.user;
            let isUser = await _database._check_user(user.uid)
              if(!isUser){  //처음 로그인 한 사람일 경우
                _database._init_user_data(user.displayName, user.photoURL, '', user.uid);   //소셜로그인 =>true
          
              }
              console.log('페이스북 ' + user.displayName +' ' + user.photoURL+' ' +  user.uid);
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

export default facebook_auth = new Facebook_auth();