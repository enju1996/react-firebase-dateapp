package com.dateapp;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    //  @Override
    // public void onCreate() {
    // super.onCreate();
    //     FacebookSdk.sdkInitialize(getApplicationContext());
    //     AppEventsLogger.activateApp(this);
    // }

    @Override
    protected String getMainComponentName() {
        return "DATEAPP";
    }
}
