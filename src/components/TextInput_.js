import React from 'react';
import {StyleSheet, TextInput, Text} from 'react-native'

export default class TextInput_ extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return (
            <TextInput 
                style={[styles.TextInput]}
                placeholder={this.props.placeholder}                    // 안내문
                keyboardType={this.props.keyboardType}          //TextInput => 이메일 키보드 타입
                underlineColorAndroid='transparent'    //밑줄 색
                value={this.props.value}
                onChangeText={this.props.onChangeText}
                defaultValue={this.props.defaultValue}
            />
        );
    }
};

const styles = StyleSheet.create({
    TextInput:{
        width:'100%',
        height:50,
        marginBottom:20,
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:5,
        borderWidth:1,
        borderBottomWidth: 1,
    },
});