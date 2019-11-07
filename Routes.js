
import React, { Component } from "react";
import {StyleSheet, Image} from 'react-native'

import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { fromBottom } from 'react-navigation-transitions';
 
import Login from "./src/screens/Login"
import Register from './src/screens/Register'
import Restore_Password from './src/screens/Restroe_Password';
import Set_Profile from './src/screens/Set_Profile';
import TimeLine from './src/screens/TimeLine';
import WriteContent from './src/screens/WriteContent';
import Update_profile from './src/screens/Update_profile';
import Search_partner from './src/screens/Search_partner';
import Receive_apply from './src/screens/Receive_apply';
import Post from './src/screens/Post';

const _STACK_MAIN = createSwitchNavigator({
  UPDATE_PROFILE : {screen :  Update_profile,
    navigationOptions: {
      header: null
    }
  },
  SEARCH_PARTNER : {screen :  Search_partner,
    navigationOptions: {
      header: null
    }
  },
  RECIEVE_APPLY:{screen: Receive_apply,
    navigationOptions: {
      header: null
    }
  }
});

const _POST = createSwitchNavigator({
  POST:{
    screen: Post,
    navigationOptions: {
      header: null
    }
  }
},
{
  transitionConfig: () => fromBottom(10000),
}
);

const _BOTTOM_MAIN = createBottomTabNavigator({
  TIMELINE : {screen :  TimeLine,
    navigationOptions: {
      header: null,
    }
  },WRITE_CONTENT:{
    screen: WriteContent,
    navigationOptions: {
      header: null,
    }
  }
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'TIMELINE') {
          return (
            <Image
              source={ require('./resource/icon/timeline.png') }
              style={{ width: 20, height: 20, }} />
          );
        } else if (routeName === 'WRITE_CONTENT') {
          return (
            <Image
              source={ require('./resource/icon/write.png') }
              style={{ width: 20, height: 20 }} />
          );
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: '#FF6F00',
      inactiveTintColor: '#263238',
    },
  }
);

const _MAIN=createStackNavigator({
  BOTTOM_MAIN : {screen : _BOTTOM_MAIN,
    navigationOptions: {
      header: null,
    }},
  STACK_MAIN : {screen: _STACK_MAIN,
    navigationOptions: {
      header: null,
    }},
    POST:{
      screen: _POST,
      navigationOptions: {
        header: null,
      }}
},
{
  initialRouteName: 'BOTTOM_MAIN' 
})

const _AUTH = createStackNavigator({
    LOGIN : {screen : Login},
    REGISTER: {screen: Register},
    RESTORE: {screen: Restore_Password},
    SET_PROFILE:{screen: Set_Profile}
},
  {
    defaultNavigationOptions: {
      header: null,
      initialRouteName: 'LOGIN'
    }
  }
  );

const Project= createSwitchNavigator({
    AUTH : {screen : _AUTH},
    MAIN : {screen:_MAIN},
  },
  {
    defaultNavigationOptions: {
      header: null,
      initialRouteName: 'AUTH'
    }
  }
  );

export default createAppContainer(Project);