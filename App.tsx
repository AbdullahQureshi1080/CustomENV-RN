/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Config from 'react-native-config';
import auth from '@react-native-firebase/auth';
import {generateRandomYopmail} from './utils';

console.log(Config.API_URL);
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState({});

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    console.log('User', user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const signIn = () => {
    auth()
      .createUserWithEmailAndPassword(generateRandomYopmail(), 'Test12345@!')
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const signout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text
          style={{
            color: '#fff',
            fontSize: 28,
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          {Config.APP_NAME}
        </Text>
        <View style={{padding: 20}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 28,
            }}>{`App ENV: ${Config.ENV_NAME}`}</Text>
          <Text style={{color: '#fff', fontSize: 18}}>
            {'Loaded Configurations:'}
          </Text>
          <View>
            <Text style={{color: '#fff'}}>
              App Version: {Config.APP_VERSION}
            </Text>
            <Text style={{color: '#fff'}}>App Name: {Config.APP_NAME}</Text>
            <Text style={{color: '#fff'}}>
              App Identifier: {Config.BUNDLE_IDENTIFIER}
            </Text>
            {Platform.OS == 'ios' ? (
              <Text style={{color: '#fff'}}>
                Build Number: {Config.BUILD_NUMBER}
              </Text>
            ) : (
              <Text style={{color: '#fff'}}>
                Version Code: {Config.VERSION_CODE}
              </Text>
            )}
            <Text style={{color: '#fff'}}>API_URL: {Config.API_BASE_URL}</Text>
          </View>
        </View>
        {!user ? (
          <View style={{padding: 20}}>
            <Text style={{color: '#fff'}} onPress={signIn}>
              Login
            </Text>
          </View>
        ) : (
          <View>
            <View style={{padding: 20}}>
              <Text style={{color: '#fff'}}>User {user?.email}</Text>
            </View>
            <View style={{padding: 20}}>
              <Text style={{color: '#fff'}} onPress={signout}>
                signout
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
