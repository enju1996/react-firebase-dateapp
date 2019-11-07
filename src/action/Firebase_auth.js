import React from 'react';
import {Alert, ToastAndroid} from 'react-native'
import {auth} from '../config/firebase_config';
import User_DTO from '../DTO/User_DTO';

//싱글톤
let instance;

class Firebase_auth extends React.Component{
    constructor(props){
        super(props)

        if (instance) return instance;

        this._user = new User_DTO();
        this._partner = new User_DTO();
        this._start_timestamp;
        instance = this;
    }

    componentDidMount() {
        this.watchAuthState(this.props.navigation);
        this.initApp();
    }

    get user() {return this._user; }
    get partner() { return this._partner;}
    get start_timestamp(){return this._start_timestamp;}

    set user(data) {this._user = JSON.parse(JSON.stringify(data)) }
    set partner(data) {this._partner = JSON.parse(JSON.stringify(data)) }
    set start_timestamp(data) {this._start_timestamp = data }

   //이메일, 비밀번호가 유효성 확인
   isValid(_email, _password, _password_e){
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;    //이메일 정규식
        var email = _email + '';
        var password = _password + '';
        var password_e = _password_e + '';

        console.log('isValid 진입');

        if(email.match(regExp) == null ){       //이메일 형식이 아님
            console.log('이메일 형식 에러');

            Alert.alert('이메일 형식오류',
            '이메일 형식이 맞지 않습니다.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                }
            ]
            )

            return false;
        }else if(password.length < 8){
            console.log('비밀번호 에러');
            Alert.alert('비밀번호 오류',
            '비밀번호가 짧습니다.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                }
            ]
            )

            return false;
        }else if(password != password_e){
            Alert.alert('비밀번호가 다릅니다.',
            '비밀번호가 다릅니다.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                }
            ]
            )

            return false;
        }
    
        return true;
   }

   //로그인
   login = async(email, password)=>{
    return new Promise(async(resolve, reject)=>{
        await auth.signInWithEmailAndPassword(email, password)
        .then(function(user){
            resolve();
            console.log('로그인 성공');
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            reject(error);
     })
    });
   }

   //사용자 변경될때마다 호출
   initApp = async ()=>{

    await auth.onAuthStateChanged(function(user) {
        
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;

          // ...
        } else {
          // User is signed out.
          // ...
        }
      });
   }
   
   //비밀번호 변경
   restore_password=(email)=>{
    var emailAddress = email;
    
    auth.sendPasswordResetEmail(emailAddress).then(()=> {
        ToastAndroid.show('해당 이메일로 이메일이 전송되었습니다.', ToastAndroid.SHORT)
        // Email sent.
    }).catch((error)=> {
        if(error.code === 'auth/user-not-found'){
            ToastAndroid.show('해당 이메일로 가입된 이력이 없습니다.', ToastAndroid.SHORT)
        }
    });
   }


   //회원등록
    register=async(email, password, password_e)=>{
    return new Promise(async(resolve, reject)=>{
    
        await auth.createUserWithEmailAndPassword(email, password)    //가입
        .then(function(user){           //유저 생성 성공
            resolve();
        })
        .catch(function(error) {        //생성실패
            switch(error.code){
                case 'auth/email-already-in-use':
                    ToastAndroid.show('이미 존재하는 계정입니다.', ToastAndroid.SHORT);
                break;
                case 'auth/operation-not-allowed':
                    ToastAndroid.show('정지된 계정입니다.', ToastAndroid.SHORT);
                break;
                case 'auth/invalid-email':
                    ToastAndroid.show('이메일 유형이 맞지 않습니다.', ToastAndroid.SHORT);
                break;
                case 'auth/weak-password':
                    ToastAndroid.show('비밀번호 보안이 약합니다.', ToastAndroid.SHORT);
                break;
            }
            reject()
        });
      });
    }

}


export default _auth = new Firebase_auth();
