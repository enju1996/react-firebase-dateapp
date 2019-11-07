import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableHighlight, Alert, ToastAndroid, ImageBackground } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import _database from '../action/Firebase_database'

import TextInput_ from '../components/TextInput_'
import Button_ from '../components/Button_'
import Image_ from '../components/Image_'

//!!!!필!!!테스트 계정 삭제!!!!!

export default class Set_Profile extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            name : '',
            profile_text : '',
            profile_picture: require('../../resource/default_avata.png'),
            isSelected : false
        }
    }

    onClickListener = (viewId)=>{
        const {name, profile_text } = this.state;
        let profile_picture;

        //등록버튼
      if(viewId == 'register'){


        if(!this.state.isSelected){  //이미지가 선택되지 않았다면
            profile_picture = false;
        }else {
            profile_picture=this.state.profile_picture;
        }

        _database._init_user_data(name, profile_picture, profile_text) //사용자의 정보를 초기 데이터로 디비에 저장
        .then(()=>{   
            this.props.navigation.navigate('TIMELINE')
        });    

      }

      if(viewId == 'me'){
        this.setState({
            name:'me',
            profile_text: 'me'
        })
      }

      if(viewId == 'you'){
        this.setState({
            name:'you',
            profile_text: 'you'
        })
      }
    }

    
    //갤러리에서 선택된 이미지의 uri 가져옴
    _SetProfile_image = async () => {

         ImagePicker.openPicker({
        }).then(images => {
            console.log(JSON.stringify(images));
          this.setState({
            profile_picture: images.path,
            isSelected: true
          })
        });
    }

    render(){
        let profileImage;

        if(this.state.isSelected){      //이미지 선택함
            profileImage=(<Image_ type='profile_big' source={{uri:this.state.profile_picture}}/>)
        }else{      //처음 이미지
            profileImage=(<Image_ type='profile_big' source={this.state.profile_picture}/>)
        }
        return( 
            <View style={{flex:1}}>
                <ImageBackground source={require('../../resource/background/login.png')} style={{width: '100%', height: '100%'}}  blurRadius={3}>   
                    <View style={styles.container}>
                        <TouchableOpacity onPress={this._SetProfile_image}>
                            {profileImage}
                        </TouchableOpacity>

                        <TextInput_ 
                            placeholder='name'                    // 안내문
                            value={this.state.name}
                            onChangeText={(name)=>this.setState({name})}
                            keyboardType='default'          //TextInput => 이메일 키보드 타입
                        />

                        <TextInput_ 
                            placeholder='소개'                 // 안내문
                            value={this.state.profile_text}
                            onChangeText={(profile_text)=>this.setState({profile_text})}
                            keyboardType='default'          //TextInput => 이메일 키보드 타입
                        />

                        <Button_ type='text' title='등록' style={styles.button} onPress={() => this.onClickListener('register')}/>

                        <View style={{flexDirection: 'row',width:'100%', justifyContent: 'center'}}>
                            <TouchableOpacity  style={{marginRight: 20}} onPress={() => this.onClickListener('me')}>
                              <Text>me</Text>
                            </TouchableOpacity> 

                            <TouchableOpacity   style={{marginRight: 20}} onPress={() => this.onClickListener('you')}>
                               <Text>you</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                </ImageBackground>
            </View>

            ) ;
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
        justifyContent: 'center',   //Flex Direction의 방향(세로방향)과 일치함
        alignItems: 'center',       //Flex Direction의 방향(세로방향)과 수직정렬
        margin: 40
    },
    button: {
        borderColor: 'white',
        borderWidth: 1,
    }
  });
