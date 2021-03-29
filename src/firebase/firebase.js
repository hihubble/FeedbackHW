import config from './config';
import firebase from 'firebase/app';
import 'firebase/database';

firebase.initializeApp(config);

export const database = firebase.database();