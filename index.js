/**
 * @format
 */


import {name as appName} from './app.json';
import { AppRegistry } from 'react-native';
import App from './App';
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
AppRegistry.registerComponent(appName, () => App);
