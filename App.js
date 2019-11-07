import React, {Component} from "react";
import {YellowBox} from 'react-native';
import Routes from "./Routes";
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const App = () => {
    
  return(<Routes/>);
}

export default App;