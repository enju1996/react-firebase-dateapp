import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native'
import Spinner from 'react-native-spinkit';

export default class Loding_ extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return (
                   <Spinner style={{flex:1}}
                            isVisible={this.props.isVisible}
                            size={80} 
                            type={this.props.type} 
                            color={this.props.color}/>
        );
    }
};
