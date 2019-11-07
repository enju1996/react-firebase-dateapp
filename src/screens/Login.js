import React from 'react';
import { StyleSheet, Text, View, Alert, Image, ImageBackground, TouchableOpacity, ToastAndroid} from 'react-native';


import { SocialIcon } from 'react-native-elements'

import Button_ from '../components/Button_'
import TextInput_ from '../components/TextInput_';
import _auth from '../action/Firebase_auth'
import Loading_ from '../components/Loading_'

import google_auth from '../action/Google_auth'
import facebook_auth from '../action/Facebook_auth'
import twitter_auth from '../action/Twitter_auth'
//!!!!필!!!테스트 계정 삭제!!!!!

export default class Login extends React.Component {
    constructor(props){
        super(props)
        console.log('LoginScreen실행');

        this.state = {
          isVisible_spiner:false,
            email : '',
            password : '',
            isLogin: false
        }

      this.spinner;
    }    

    onClickListener = async(viewId)=>{

      //회원가입 버튼
      if(viewId == 'register'){
        this.props.navigation.navigate('REGISTER');

      }
        
        //비밀번호 찾기
      if(viewId == 'restore_password'){
        this.props.navigation.navigate('RESTORE');
      }

      if(viewId == 'me'){
        this.setState(
          {email: 'me@naver.com',
           password:'11111111'
          }
          )
      }

      if(viewId == 'you'){
        this.setState(
          {email: 'you@naver.com',
           password:'11111111'
          }
          )
      }

      //로그인 버튼
      if(viewId == 'login'){
      
        if(this.state.email == '' || this.state.password == ''){    //비밀번호나 아이디 칸이 비어있음
            console.log('값 비어있음');

            Alert.alert('로그인 오류',
            '이메일 및 비밀번호를 입력해주세요',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                }
            ]
        )}else{   //빈칸없음
          const {email, password} = this.state;       //도중에 값이 변경되지 않는다 것 보장

          this.setState({isVisible_spiner:true});

          _auth.login(email, password)
          .then(()=>{
            this.props.navigation.navigate('TIMELINE');
          })
          

          this.setState({isVisible_spiner:false});

      }
    }
  }

  componentDidMount(){

  }
  handleFacebookLogin =async()=> {
    await facebook_auth._init_account()   //엑세스 토큰 가져옴
    .then(async(credential)=>{
      this.setState({isVisible_spiner:true})
      await facebook_auth._login(credential)    //토큰으로 로그인
    })
    .then(()=>{
      this.setState({isVisible_spiner:false},()=>{
        this.props.navigation.navigate('TIMELINE')
      });    
    })
    .catch((err)=>{
      console.log(err)
      ToastAndroid.show('권한 상태를 확인해주세요', ToastAndroid.SHORT);
    })
  }

  handlegoogleLogin = async () => {
    this.setState({isVisible_spiner:true})

   await google_auth._login()
    .then(()=>{
      this.setState({isVisible_spiner:false},()=>{
        this.props.navigation.navigate('TIMELINE')
      });    
    })
    .catch(()=>{
      ToastAndroid.show('권한 상태를 확인해주세요', ToastAndroid.SHORT);
    })
  }

   handleTwitterLogin = async() => {
    this.setState({isVisible_spiner:true})

    await twitter_auth._login()
     .then(()=>{
       this.setState({isVisible_spiner:false},()=>{
         this.props.navigation.navigate('TIMELINE')
       });    
     })
     .catch(()=>{
       ToastAndroid.show('권한 상태를 확인해주세요', ToastAndroid.SHORT);
     })
  }

  render(){

    if(this.state.isVisible_spiner){    //로그인을 시도할 경우 .. 시피너
      return (
        <View style={{flex:1}}>
          <ImageBackground source={require('../../resource/background/login.png')} style={{width: '100%', height: '100%'}}  blurRadius={3}>
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Loading_ 
                type='ThreeBounce'
                color='white'
                 isVisible={this.state.isVisible_spiner}/>  
            </View>
          </ImageBackground>
        </View>
      );
    }

    return(
      <View style={{flex:1}}>
            <ImageBackground source={require('../../resource/background/login.png')} style={{width: '100%', height: '100%'}}  blurRadius={3}>
                <View style={styles.container}>
                  <View style={styles.view__Logo}>
                    <Image style={{width: '100%', resizeMode:'contain'}} source={require('../../resource/logo.png')}/>
                  </View>

                  <View style={styles.view__input}>
                      <TextInput_ 
                        placeholder='Email'                    // 안내문
                        keyboardType='email-address'           //TextInput => 이메일 키보드 타입
                        underlineColorAndroid='transparent'    //밑줄 색
                        value={this.state.email}
                        onChangeText={(email)=>this.setState({email})}
                      />
                      <TextInput_ 
                          placeholder='password'                 // 안내문
                          secureTextEntry={true}                 //입력한 텍스트를 가림
                          underlineColorAndroid='transparent'    //밑줄 색
                          value={this.state.password}
                          onChangeText={(password)=>this.setState({password})}
                      />
                        
                      <Button_ type='text' style={styles.button} title='로그인' onPress={() => this.onClickListener('login')}/> 

                      <View style={{flexDirection: 'row',width:'100%', justifyContent: 'center'}}>
                        <TouchableOpacity  style={{marginRight: 20}} onPress={() => this.onClickListener('me')}>
                          <Text>me</Text>
                        </TouchableOpacity> 

                        <TouchableOpacity   style={{marginRight: 20}} onPress={() => this.onClickListener('you')}>
                          <Text>you</Text>
                        </TouchableOpacity> 
                      </View>

                      <View style={{flexDirection: 'row',width:'100%', justifyContent: 'center'}}>
                        <TouchableOpacity  style={{marginRight: 20}}onPress={() => this.onClickListener('restore_password')}>
                            <Text>비밀번호 찾기</Text>
                          </TouchableOpacity> 

                        <TouchableOpacity   style={{marginRight: 20}} onPress={() => this.onClickListener('register')}>
                          <Text>가입</Text>
                        </TouchableOpacity> 
                      </View>
                    </View>

                    <View style={styles.view__social}>
                      <SocialIcon
                        type='google'
                        onPress={this.handlegoogleLogin}
                      />

                      <SocialIcon
                      type='facebook'
                      onPress={this.handleFacebookLogin}
                    />

                      <SocialIcon
                      type='twitter'
                      onPress={this.handleTwitterLogin}
                    />
                    </View>
                      </View>
                </ImageBackground>
          </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {   
      flex: 1,              
      flexDirection: 'column',
      justifyContent: 'center',   //Flex Direction의 방향(세로방향)과 일치함
    },
    view__Logo:{
      margin: 30,
    },
    view__input:{
      margin: 10,
    },
    view__social:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'center',
      margin: 10,
    },
    button: {
      borderColor: 'white',
      borderWidth: 1,
    },
    loginText: {
      color: 'white',
    },
    background:{
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
    }
  });
