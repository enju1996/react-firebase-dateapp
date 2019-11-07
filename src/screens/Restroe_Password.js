import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Alert, ImageBackground } from 'react-native';
import {createAppContainer, createStackNavigator} from 'react-navigation'
import _auth from '../action/Firebase_auth';

import Button_ from '../components/Button_'
import TextInput_ from '../components/TextInput_';

export default class  Restroe_Password extends React.Component {

    constructor(props){
        super(props)

        console.log('STAK-- RestorePasswordScreen');

        this.state = {
            email : '',
        }

        this.test={
            email : 'ju7056k@naver.com',
            password : '123456789'
          }

        myAuth = new Fire_auth();
    }

    onClickListener=(viewId)=>{
        if(viewId == 'send'){
            if(this.state.email != ''){
                const {email} = this.state;

                myAuth.restore_password(this.test.email);
            }else{
                Alert.alert('이메일 에러',
                    '이메일이 비어있습니다.',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    }
                ]
                )
            }
        }
    }

    render(){
        return (
            <View style={{flex:1}}>
                <ImageBackground source={require('../../resource/background/login.png')} style={{width: '100%', height: '100%'}}  blurRadius={3}>   
                    <View style={styles.container}>
                        <TextInput_ 
                                    placeholder='Email'                    // 안내문
                                    keyboardType='email-address'           //TextInput => 이메일 키보드 타입
                                    underlineColorAndroid='transparent'    //밑줄 색
                                    value='ju7056k@naver.com'
                                    onChangeText={(email)=>this.setState({email})}
                            />

                        <Button_ style={styles.button} type='text' title='메일 전송' onPress={() => this.onClickListener('send')}/>
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
        margin: 10
    },
      button: {
        borderColor: 'white',
        borderWidth: 1,
      },
  }      
);