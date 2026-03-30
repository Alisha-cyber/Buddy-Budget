import {
    GoogleSignin,
    statusCodes,
  } from "@react-native-google-signin/google-signin";
  
  GoogleSignin.configure({
    webClientId:
      "389501539554-fv0irv4fbeoq2mf10v147ag2033mkmhu.apps.googleusercontent.com",
    iosClientId:
      "389501539554-utqshcoe0omsoaf7eunceo9lkheadopp.apps.googleusercontent.com",
  });
  
  export async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
  
      const user = result?.data?.user || result?.user || null;
      const idToken = result?.data?.idToken || result?.idToken || null;
  
      return { user, idToken };
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