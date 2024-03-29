import React from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome, Octicons } from '@expo/vector-icons';
import FadeIn from 'react-native-fade-in-image';
import styles from './styles';
import { Camera } from 'expo';

const Preview = props => {
  // console.log('______', props.cameraProps);
  return (
    <View>
      <FadeIn>
        {props.cameraProps.cameraType === Camera.Constants.Type.front ? (
          <Image
            source={{ uri: props.cameraProps.uri }}
            style={[
              styles.mirror,
              props.cameraProps.flip
                ? { transform: [{ rotateY: '0deg' }] }
                : styles.mirror,
            ]}
          />
        ) : (
          <Image
            source={{ uri: props.cameraProps.uri }}
            style={[
              styles.preview,
              props.cameraProps.flip ? styles.mirror : styles.preview,
            ]}
          />
        )}
      </FadeIn>
      {/* HUD */}
      <View style={styles.hud}>
        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            backgroundColor: 'pink',
          }}
          onPress={() => {
            props.cameraProps.savePhoto();
            props.cameraProps.resetFlip()
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Feather
              name="save"
              size={30}
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginTop: 1.5,
                marginLeft: 1,
              }}
            />
          </View>
        </TouchableOpacity>
        {/* FLIP */}
        <TouchableOpacity
          style={{ width: 35, height: 35, backgroundColor: 'goldenrod' }}
          onPress={() => props.cameraProps.flipPhoto()}
        >
          <View style={{ alignItems: 'center' }}>
            <Octicons
              name="mirror"
              size={30}
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginTop: 2,
                marginLeft: 1,
              }}
            />
          </View>
        </TouchableOpacity>
        {/* REPEAT */}
        <TouchableOpacity
          style={{ width: 35, height: 35, backgroundColor: 'darkolivegreen' }}
          onPress={() => {
            props.cameraProps.playCompliment();
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <FontAwesome
              name="repeat"
              size={30}
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginTop: 2,
              }}
            />
          </View>
        </TouchableOpacity>
        {/* CANCEL */}
        <TouchableOpacity
          style={{ width: 35, height: 35, backgroundColor: 'darkslateblue' }}
          onPress={() => {props.cameraProps.cancelPhoto(); props.cameraProps.resetFlip()}}
        >
          <View style={{ alignItems: 'center' }}>
            <FontAwesome
              name="remove"
              size={32}
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginLeft: 1,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Preview;
