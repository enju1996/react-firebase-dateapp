
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

import com.dateapp.BuildConfig;
import com.dateapp.R;

// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// react-native-fbsdk
import com.facebook.reactnative.androidsdk.FBSDKPackage;
// react-native-geolocation-service
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-google-signin
import co.apptailor.googlesignin.RNGoogleSigninPackage;
// react-native-image-crop-picker
import com.reactnative.ivpusic.imagepicker.PickerPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-kakao-logins
import com.dooboolab.kakaologins.RNKakaoLoginsPackage;
// react-native-naver-login
import com.dooboolab.naverlogin.RNNaverLoginPackage;
// react-native-oauth
import io.fullstack.oauth.OAuthManagerPackage;
// react-native-sparkbutton
import com.github.godness84.RNSparkButton.RNSparkButtonPackage;
// react-native-spinkit
import com.react.rnspinkit.RNSpinkitPackage;
// rn-fetch-blob
import com.RNFetchBlob.RNFetchBlobPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  public PackageList(ReactNativeHost reactNativeHost) {
    this.reactNativeHost = reactNativeHost;
  }

  public PackageList(Application application) {
    this.reactNativeHost = null;
    this.application = application;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new GeolocationPackage(),
      new FBSDKPackage(),
      new RNFusedLocationPackage(),
      new RNGestureHandlerPackage(),
      new RNGoogleSigninPackage(),
      new PickerPackage(),
      new ImagePickerPackage(),
      new RNKakaoLoginsPackage(),
      new RNNaverLoginPackage(),
      new OAuthManagerPackage(),
      new RNSparkButtonPackage(),
      new RNSpinkitPackage(),
      new RNFetchBlobPackage()
    ));
  }
}
