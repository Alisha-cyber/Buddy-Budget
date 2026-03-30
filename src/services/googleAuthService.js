import {
    GoogleSignin,
    statusCodes,
  } from "@react-native-google-signin/google-signin";
  
  GoogleSignin.configure({
    webClientId: "YOUR_GOOGLE_WEB_CLIENT_ID",
    iosClientId: "YOUR_GOOGLE_IOS_CLIENT_ID",
  });
  
  export async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
  
      const user = result?.data?.user || result?.user || null;
      const idToken = result?.data?.idToken || result?.idToken || null;
  
      return {
        user,
        idToken,
      };
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return null;
      }
  
      if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error("Google sign-in already in progress.");
      }
  
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error("Google Play Services not available.");
      }
  
      throw error;
    }
  }
  
  export async function signOutGoogle() {
    await GoogleSignin.signOut();
  }