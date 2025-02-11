// Lighting. Could be improved
import {AmbientLight, DirectionalLight, DirectionalLightHelper, HemisphereLight} from "../three.js/build/three.module";
import {Sit} from "./Globals";
import * as LAYER from "./LayerMasks";
import {GlobalScene} from "./LocalFrame";


export function addDefaultLights(brightness = 100) {

    if (Sit.useGlobe) {
        Sit.ambientLight = new AmbientLight(0xFFFFFF, 0.1);
        GlobalScene.add(Sit.ambientLight);

        Sit.sunLight = new DirectionalLight(0xffffff, 3);
        Sit.sunLight.position.set(5,0,0);  // sun is along the X axis
        GlobalScene.add(Sit.sunLight);

        const helper = new DirectionalLightHelper( Sit.sunLight, 1 );
        GlobalScene.add( helper );
    } else {

        var light = new DirectionalLight(0xffffff, 0.8 * brightness / 100);  /// was 0.8
        light.position.set(100, 300, 100);
        light.layers.enable(LAYER.LOOK);
        light.layers.enable(LAYER.MAIN);
        light.castShadow = false
        GlobalScene.add(light);

        const hemiLight = new HemisphereLight(
            'white', // bright sky color
            'darkslategrey', // dim ground color
            0.3 * brightness / 100, // intensity was 0.3
        );
        hemiLight.castShadow = false
        hemiLight.layers.enable(LAYER.LOOK)
        hemiLight.layers.enable(LAYER.MAIN);


        GlobalScene.add(hemiLight);
    }
}