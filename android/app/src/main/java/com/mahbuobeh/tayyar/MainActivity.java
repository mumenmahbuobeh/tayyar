package com.mahbuobeh.tayyar;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TayyarMobilePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
