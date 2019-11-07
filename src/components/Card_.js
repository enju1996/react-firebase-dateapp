import React from 'react';
import {View, Image, StyleSheet, TextInput, Text} from 'react-native'
import APPLICATION_TEXT from '../Strings';
import Button_ from '../components/Button_'
import {ListItem } from 'native-base';

export default class Card_ extends React.Component{
    
    render(){
        let src;
        let element = APPLICATION_TEXT.TIMELINE__CARD[this.props.code];
        console.log(JSON.stringify(element))
        switch(this.props.code){
            case 0:
                src = require('../../resource/icon/setting_profile.png');
            break;
            case 1:
                src = require('../../resource/icon/insert_partner.png');
            break;
            case 2:
                src = require('../../resource/icon/alarm.png');
            break;
        }

        return (
            <ListItem key={this.props.code}>
                <View style={styles.card}>
                    <View style={styles.card__content}>
                        <Image style={styles.icon} source={src}/>
                    </View>

                    <View style={styles.card__content}>
                        <Text style={styles.title}>{element.TITLE}</Text>
                        <Text>{element.CONTENT}</Text>
                    </View>
                    <View style={styles.card__content}>
                      <Button_ style={styles.button} type='text' title={element.BUTTON_TEXT} onPress={this.props.onPress}/>
                    </View>
                </View>
         </ListItem>
        );
    }
}

const styles = StyleSheet.create({
card:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width:250,
    height: 250,
    backgroundColor: 'white',
    borderRadius:10,
    borderStyle: 'dashed',
    borderWidth:3,
    marginTop:20,
    marginLeft:10,
    marginBottom:2,
    padding:20
  },
  card__content:{
    flex:1,
    width:'100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon:{
    width: 50,
    height:50
  },
  title:{
    fontSize:20
  },
  button:{
    backgroundColor:'#0000e6'
  }

});