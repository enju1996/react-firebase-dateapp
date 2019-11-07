import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, ImageBackground } from 'react-native';
import {createAppContainer, createStackNavigator} from 'react-navigation'
import _auth from '../action/Firebase_auth';

import Loading_ from '../components/Loading_'
import TextInput_ from '../components/TextInput_'
import Button_ from '../components/Button_'
export default class Register extends React.Component {

    constructor(props){
      console.log('STAK-- CreateAccountScreen');

        super(props)
        this.state = {
            email : '',
            password : '',
            password_e:'',
            isVisible:false
          }

        
    }

    onClickListener = (viewId)=> {
       
        if(viewId == 'register_ok'){
          this.setState({isVisible_spiner: true},async()=>{   //스피너 출력
            await this.auth.register( this.state.email, this.state.password, this.state.password)   //회원등록
            .then(async()=>{
              await this.auth.login(this.state.email, this.state.password).then(()=>{//가입성공시 로그인
                this.setState({isVisible_spiner:false},()=>{    
                  console.log('SET_PROFILE')
                  this.props.navigation.navigate('SET_PROFILE');
                })
              })
              .catch((err)=>{
                console.log(err);
              });
            }).catch((err)=>{   //회원등록 실패
              console.log(err);
              this.setState({isVisible_spiner: false})
            });   
        })
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

    }

    render(){
      if(this.state.isVisible_spiner){    //로그인을 시도할 경우 .. 시피너
        return (
          <View style={{flex:1}}>
            <ImageBackground source={require('../../resource/background/login.png')} style={{width: '100%', height: '100%'}}  blurRadius={3}>
              <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Loading_ 
                color='whtie'
                  type='ThreeBounce'
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
                    <TextInput_ style={styles.inputs}
                        placeholder='Email'                    // 안내문
                        keyboardType='email-address'           //TextInput => 이메일 키보드 타입
                        underlineColorAndroid='transparent'    //밑줄 색
                        value={this.state.email}
                        onChangeText={(email)=>this.setState({email})}
                    />

                    <TextInput_ style={styles.inputs}
                        placeholder='password'                    // 안내문
                        secureTextEntry={true}                 //입력한 텍스트를 가림
                        underlineColorAndroid='transparent'    //밑줄 색
                        value={this.state.password}
                        onChangeText={(password)=>this.setState({password})}
                    />
             

                    <TextInput_ style={styles.inputs}
                        placeholder='Confirm password'                    // 안내문
                        secureTextEntry={true}                 //입력한 텍스트를 가림
                        underlineColorAndroid='transparent'    //밑줄 색
                        value={this.state.password}
                        onChangeText={(password_e)=>this.setState({password_e})}
                    />
           

                  <Button_ type='text' style={styles.button} title='확인'  onPress={() => this.onClickListener('register_ok')}/>
              

                  <Button_ type='text' style={styles.button} title='me' onPress={() => this.onClickListener('me')}/> 
                  

                  <Button_ type='text' style={styles.button} title='you' onPress={() => this.onClickListener('you')}/> 
            
                </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,                    //크기를 비율로 설정, 화면전체 1
      justifyContent: 'center',   //Flex Direction의 방향(세로방향)과 일치함
      alignItems: 'center',       //Flex Direction의 방향(세로방향)과 수직정렬
      marginLeft: 10,
      marginRight: 10
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height:45,
        marginBottom:20,
        flexDirection: 'row',   //뷰를 가로방향으로 default:세로방향
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,                   //부모 뷰의 크기중 비율
    },
    loginText: {
      color: 'white',
    },
    button: {
      borderColor: 'white',
      borderWidth: 1,
    },

  });