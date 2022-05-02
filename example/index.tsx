/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './app/app';
import { name as appName } from './app.json';
import Config from "react-native-config"
console.log('====================================');
console.log("process", Config.API_URL);
console.log('====================================');
AppRegistry.registerComponent(appName, () => App);
