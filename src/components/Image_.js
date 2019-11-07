import React from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native'

export default class Image_ extends React.Component{
    constructor(props){
        super(props);
        this.state={
            style:''
        }
    }


    render(){
        
        switch(this.props.type){
            case 'big' :
                this.state.style = styles.big;
            break;
            case 'medium' :
                this.state.style = styles.medium;
            break;
            case 'small' :
                this.state.style = styles.small;
            break;
            case 'profile_big' :
                this.state.style = styles.profile_big;
            break;
            case 'profile_medium' :
                this.state.style = styles.profile_medium;
            break;
            case 'profile_small' :
                this.state.style = styles.profile_small;
            break;
        }
        return (
                <Image style={this.state.style} source={this.props.source}/>
        );
    }
};

const styles = StyleSheet.create({
    big:{
        flex: 1,
        height: 300,
        width: '100%',
        margin: 3
      },
      medium:{
        flex: 1,
        height: 200,
        width: '100%',
        margin: 3
      },
      small:{
        flex: 1,
        height: 150,
        width: '100%',
        margin: 3
      },
      profile_big:{
        width : 250,
        height: 250,
        borderRadius: 125,
        marginBottom: 30
    },
      profile_medium:{
        width:75,
        height:75,
        borderRadius:37.5
        },
      profile_small:{
        width: 40,
        height: 40,
        borderRadius: 20,
      }

});