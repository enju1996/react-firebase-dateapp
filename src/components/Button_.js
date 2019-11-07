import React from 'react';
import {StyleSheet, TouchableOpacity, Text, Image} from 'react-native'

export default class Button_ extends React.Component{
    constructor(props){
        super(props);

        this.content;
    }


    render(){
        switch(this.props.type){
            case 'google':
                this.content=(<Image style={styles.social_icon} source={require('../../resource/social_login_icon/google.png')}/>);
            break;

            case 'naver':
                this.content=(<Image style={styles.social_icon} source={require('../../resource/social_login_icon/naver.png')}/>);
            break;

            case 'facebook':
                this.content=(<Image style={styles.social_icon} source={require('../../resource/social_login_icon/facebook.png')}/>);
            break;

            case 'kakaotalk':
                this.content=(<Image style={styles.social_icon} source={require('../../resource/social_login_icon/kakaoTalk.png')}/>);
            break;
            case 'text':
                this.content=(<Text style={[styles.title]}>{this.props.title}</Text>);
            break;
        }

        if(this.props.type === 'text'){
            return(
            <TouchableOpacity onPress={this.props.onPress} style={[styles.button, this.props.style]}>
              {this.content}
            </TouchableOpacity>
            );
        }else{
            return(
            <TouchableOpacity onPress={this.props.onPress}>
             {this.content}
            </TouchableOpacity>
            );    
        }
            
    }
}

const styles = StyleSheet.create({
button: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:'100%',
    borderRadius:5,
  },
  title:{
      fontSize:15,
      color: 'white'
    },
  social_icon:{
      width: 50,
      height: 50,
      margin: 10
  }
});