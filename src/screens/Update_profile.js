import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableHighlight, Alert, ToastAndroid, ImageBackground } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from "react-native-modal";

import _auth from '../action/Firebase_auth'
import _database from '../action/Firebase_database'

import TextInput_ from '../components/TextInput_'
import Button_ from '../components/Button_'
import Image_ from '../components/Image_'
import Loading_ from '../components/Loading_'

//!!!!필!!!테스트 계정 삭제!!!!!

export default class Udpate_profile extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            name : _auth.user._username,
            profile_text : _auth.user._profile_text,
            uri: _auth.user._profile_picture,
            isSelected : false,
            isVisible_modal: false
        }
    }

    onClickListener = (viewId)=>{
        const {name, profile_text} = this.state;   //uri : 갤러리에서 가져온 사진
        let uri = this.state.uri;
        //등록버튼
      if(viewId == 'register'){
        if(!this.state.isSelected){     //이미지 선택 안함
            uri=false;
        }
        _auth.user._username = name;
        _auth.user._profile_text = profile_text;

        this.setState({isVisible_modal:true},()=>{
            _database._update_profile(uri)
            .then(()=>{
                this.setState({isVisible_modal:false});
                this.props.navigation.navigate('TIMELINE')
            });
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

    componentDidMount(){
        
    }

    //갤러리에서 선택된 이미지의 uri 가져옴
    _SetProfile_image = async () => {

         ImagePicker.openPicker({
        }).then(images => {
            console.log(JSON.stringify(images));
          this.setState({
            uri: images.path,
            isSelected: true
          })
        });
    }

    _render_modal=()=>{
        return(
            <View style={{flex:1}}>
            <Modal isVisible={this.state.isVisible_modal}
                    animationType = {"slide"} >
              <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Loading_ 
                        color='white'
                        type='FadingCircleAlt'
                        isVisible={this.state.isVisible_modal}/>
              </View>
            </Modal>
          </View>
        );
    }
    render(){
        return( 
            <View style={{flex:1}}>
             {this._render_modal()}
            <ImageBackground source={require('../../resource/background/login.png')} style={{width: '100%', height: '100%'}}  blurRadius={3}>   
                <View style={styles.container}>
                    <TouchableOpacity onPress={this._SetProfile_image}>
                        <Image_ type='profile_big' source={{uri:this.state.uri}}/>
                    </TouchableOpacity>

                    <TextInput_ 
                            defaultValue={this.state.name}
                        onChangeText={(name)=>this.setState({name})}
                        keyboardType='default'          //TextInput => 이메일 키보드 타입
                    />

                    <TextInput_ 
                        value={this.state.profile_text}
                        defaultValue={this.state.profile_text}
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
