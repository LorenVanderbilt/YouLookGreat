import React from 'react';
import { Camera, Permissions, Audio } from 'expo';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Icon } from 'native-base';
import {
  Ionicons,
  AntDesign,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
import Preview from './Preview';

// import styles from './styles';

// [[all, one, sounds],[all, two, sounds], [all, three, sounds]...]
// will DRY this out once all vocals are recorded and added
const allSounds = [
  [require('../assets/audio/1.mp3')],
  [require('../assets/audio/2.mp3')],
  [require('../assets/audio/3.mp3')],
  [require('../assets/audio/4.mp3')],
  [require('../assets/audio/5.mp3')],
  [require('../assets/audio/6.mp3')],
  [require('../assets/audio/7.mp3')],
  [require('../assets/audio/8.mp3')],
  [require('../assets/audio/9.mp3')],
  [require('../assets/audio/10.mp3')],
];

const expSounds = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]];

export default class CameraComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null,
      hasCameraPermission: null,
      cameraType: Camera.Constants.Type.front,
      flashMode: Camera.Constants.FlashMode.off,
      zoom: 0,
      values: this.props.screenProps.values,
      compliment: null,
      girl: this.props.screenProps.girl,
      leftHanded: this.props.screenProps.leftHanded,
      flip: false,
      mute: false,
    };
  }

  /* FUNCTIONS */
  setFlashMode = flashMode => this.setState({ flashMode });

  setCameraType = cameraType => this.setState({ cameraType });

  takePicture = async () => {
    try {
      // take pic
      const data = await this.camera.takePictureAsync();
      this.setState({ path: data.uri });
      this.pickCompliment();
      // console.log('this is the photo data', data)
      // console.log('[][][][][', this.state.path)
    } catch (err) {
      console.log('err: ', err);
    }
  };

  pickCompliment = () => {
    const soundBank = allSounds
      .slice(this.state.values[0] - 1, this.state.values[1])
      .flat();
    const compliment = soundBank[Math.floor(Math.random() * soundBank.length)];
    this.setState({ compliment: compliment });
    // console.log('++++', compliment)
    this.playCompliment();
  };

  playCompliment = async () => {
    const { sound } = await Audio.Sound.createAsync(this.state.compliment, {
      shouldPlay: true,
      isLooping: false,
      isMuted: this.state.mute,
    });
    this.sound = sound;
  };

  cancelPhoto = () => {
    this.setState({ path: null });
  };

  flipPhoto = () => {
    this.setState({
      flip: this.state.flip === false ? true : false,
    });
  };
  /* LIFECYCLE */
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  }

  // when user changes options, this will update the state
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.screenProps.values !== prevState.values ||
      nextProps.screenProps.leftHanded !== prevState.leftHanded ||
      nextProps.screenProps.girl !== prevState.girl
    ) {
      // console.log('camera state is firing');
      return {
        values: nextProps.screenProps.values,
        leftHanded: nextProps.screenProps.leftHanded,
        girl: nextProps.screenProps.girl,
      };
    } else {
      return null; // Triggers no change in the state
    }
  }

  renderCamera() {
    const {
      hasCameraPermission,
      flashMode,
      leftHanded,
      girl,
      mute,
      zoom,
    } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text> No access to camera </Text>;
    }
    return (
      <Camera
        ref={camera => {
          this.camera = camera;
        }}
        style={styles.preview}
        flashMode={flashMode}
        type={this.state.cameraType}
        zoom={zoom}
      >
        {/* HUD */}
        <View style={[leftHanded ? styles.leftHand : styles.rightHand]}>
          {/* SETTINGS BUTTON */}
          <TouchableHighlight
            style={{
              width: 35,
              height: 35,
              backgroundColor: 'lightcoral',
              marginTop: 170,
            }}
            onPress={() => this.props.navigation.navigate('Settings')}
          >
            <View style={{ alignItems: 'center' }}>
              <AntDesign
                name="setting"
                size={30}
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  marginTop: 2,
                  marginLeft: 0.5,
                }}
              />
            </View>
          </TouchableHighlight>
          {/* VOLUME BUTTON */}
          <TouchableHighlight
            style={{ width: 35, height: 35, backgroundColor: 'goldenrod' }}
            onPress={() => {
              this.setState({
                mute: mute === true ? false : true,
              });
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Feather
                name={mute == true ? 'volume' : 'volume-x'}
                size={32}
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </View>
          </TouchableHighlight>
          {/* GALLERY BUTTON */}
          <TouchableHighlight
            style={{ width: 35, height: 35, backgroundColor: 'darkolivegreen' }}
            onPress={() => this.props.navigation.navigate('Gallery')}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon
                name="md-images"
                style={{
                  color: 'white',
                  marginTop: 1.4,
                  marginLeft: 1,
                }}
              />
            </View>
          </TouchableHighlight>
          {/* CAMERA TYPE BUTTON */}
          <TouchableHighlight
            style={{ width: 35, height: 35, backgroundColor: 'pink' }}
            onPress={() => {
              this.setState({
                cameraType:
                  this.state.cameraType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                zoom: this.state.zoom === 0.1 ? 0 : 0,
              });
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Ionicons
                name="md-reverse-camera"
                size={30}
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  marginTop: 1.5,
                }}
              />
            </View>
          </TouchableHighlight>
          {/* FLASH BUTTON */}
          <TouchableHighlight
            style={{ width: 35, height: 35, backgroundColor: 'darkslateblue' }}
            onPress={() =>
              this.setFlashMode(
                flashMode === Camera.Constants.FlashMode.on
                  ? Camera.Constants.FlashMode.off
                  : Camera.Constants.FlashMode.on
              )
            }
          >
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons
                name={
                  flashMode == Camera.Constants.FlashMode.on
                    ? 'flash-on'
                    : 'flash-off'
                }
                size={30}
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  marginTop: 3,
                  marginLeft: 2,
                }}
              />
            </View>
          </TouchableHighlight>
          {/* BACK ONLY / ZOOM BUTTON */}
          {this.state.cameraType === Camera.Constants.Type.back ? (
            <TouchableHighlight
              style={{ width: 35, height: 35, backgroundColor: 'lightcoral' }}
              onPress={() => {
                this.setState({
                  zoom: this.state.zoom === 0 ? 0.1 : 0,
                });
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Feather
                  name={zoom == 0 ? 'zoom-in' : 'zoom-out'}
                  size={30}
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    marginTop: 1,
                    marginLeft: 1,
                  }}
                />
              </View>
            </TouchableHighlight>
          ) : null}
        </View>
        {/* CAPTURE PHOTO BUTTON */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 10,
            marginBottom: 15,
            zIndex: 1,
          }}
        >
          <TouchableHighlight
            style={styles.capture}
            onPress={this.takePicture.bind(this)}
            // COME BACK TO THIS
            underlayColor="rgba(255, 255, 255, 0.5)"
          >
            <View />
          </TouchableHighlight>
        </View>
      </Camera>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.path ? (
          <Preview
            cameraProps={{
              uri: this.state.path,
              playCompliment: this.playCompliment,
              path: this.state.path,
              flip: this.state.flip,
              refreshGallery: this.props.screenProps.refreshGallery,
              cancelPhoto: this.cancelPhoto,
              flipPhoto: this.flipPhoto,
            }}
          />
        ) : (
          this.renderCamera()
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  rightHand: {
    flexDirection: 'column',
    alignItems: 'flex-end', //right
    justifyContent: 'center',
    //distance from the edge of screen
    paddingHorizontal: 5,
    marginBottom: 15,
    height: Dimensions.get('window').height - 100,
  },
  leftHand: {
    flexDirection: 'column',
    alignItems: 'flex-start', // left
    justifyContent: 'center',
    //distance from the edge of screen
    paddingHorizontal: 5,
    marginBottom: 15,
    height: Dimensions.get('window').height - 100,
  },
});
