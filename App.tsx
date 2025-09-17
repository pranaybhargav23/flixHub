import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigation from './src/navigations/StackNavigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';
import { useEffect } from 'react';



function App() {
   GoogleSignin.configure({
      webClientId: '23587529061-7tbrugdss8uu5mkfv7iv2msq7fsgfbni.apps.googleusercontent.com',
    });
    
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={'dark-content'} hidden={true} />
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
