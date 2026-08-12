import { signInAnonymously, GoogleAuthProvider, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseClient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

// NOTE: Remember to configure GoogleSignin in your app's entry point or before calling it, e.g.:
// GoogleSignin.configure({
//   webClientId: 'YOUR_WEB_CLIENT_ID', // From Firebase Console -> Project Settings -> General -> Web App
// });

export const authService = {
  /**
   * Logs in the user anonymously.
   */
  async loginAnonymous() {
    try {
      const userCredential = await signInAnonymously(auth);
      return userCredential.user;
    } catch (error) {
      console.error('[AuthService] Anonymous login failed:', error);
      throw error;
    }
  },

  /**
   * Logs in the user using Google Sign-In.
   */
  async loginGoogle() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      
      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      return userCredential.user;
    } catch (error) {
      console.error('[AuthService] Google login failed:', error);
      throw error;
    }
  },

  /**
   * Logs in the user using Apple Sign-In.
   */
  async loginApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      const provider = new OAuthProvider('apple.com');
      const authCredential = provider.credential({
        idToken: credential.identityToken,
      });

      const userCredential = await signInWithCredential(auth, authCredential);
      return userCredential.user;
    } catch (error) {
      console.error('[AuthService] Apple login failed:', error);
      throw error;
    }
  },

  /**
   * Logs out the current user.
   */
  async logout() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('[AuthService] Logout failed:', error);
      throw error;
    }
  }
};
