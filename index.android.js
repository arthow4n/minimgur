import React, {
    AppRegistry,
    AsyncStorage,
    BackAndroid,
    Clipboard,
    Component,
    Navigator,
    ProgressBarAndroid as ProgressBar,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid as Toast,
    TouchableHighlight,
    View
} from 'react-native';

import {
    MKButton,
    MKColor
} from 'react-native-material-kit';

import { ImagePickerManager } from 'NativeModules';

import { CLIENT_ID } from './imgur.config.js';

const STORAGE_KEY = '@Minimgur:state';

const mkButtonCommonProps = {
    backgroundColor: MKColor.Teal,
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    shadowRadius: 2,
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.7,
    shadowColor: 'black',
};
class minimgur extends Component {

    constructor(props) {
        super(props);
        this.renderScene = this.renderScene.bind(this);
        this.uploadToImgur = this.uploadToImgur.bind(this);
        this.copyResultsToClipboard = this.copyResultsToClipboard.bind(this);
        this.saveState = this.saveState.bind(this);
        this.state = {};
    }

    async loadInitialState() {
        try {
            const state = await AsyncStorage.getItem(STORAGE_KEY);
            if (state !== null) {
                this.setState(JSON.parse(state));
            } else {
                // the state on clean start
                this.setState({
                    settings: {
                        autoCopyOnUploadSuccess: true,
                        precompressBeforeUpload: false,
                    },
                    results: '',
                    history: [],
                });
            }
        } catch (error) {
            console.error(error);
        }
        this.refs.navigator.resetTo({name: 'home'});
    }

    saveState() {

    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', function() {
            const currentRouteName = this.refs.navigator.getCurrentRoutes().slice(-1)[0].name;
            switch (currentRouteName) {
                case 'home':
                    BackAndroid.exitApp();
                    break;
                case 'results':
                    this.refs.navigator.resetTo({name: 'home'});
                    break;
                case 'uploading':
                    break;
                default:
                    this.refs.navigator.pop();
            }
            return true;
        }.bind(this));

        this.loadInitialState().done();
    }

    render() {
        return (
            <Navigator
                ref="navigator"
                initialRoute={{name: 'initializing'}}
                renderScene={this.renderScene}
                />
        );
    }

    renderScene(route, navigator) {
        switch (route.name) {
            case 'initializing':
                return (
                    <View style={styles.container}>
                        <ProgressBar styleAttr="Large" />
                    </View>
                )
            case 'home':
                return (
                    <View style={styles.container}>

                        <View style={[styles.row, styles.rowFirst]}>
                            <View style={styles.rowFirst} onPress={() => navigator.resetTo({name: 'home'})}>
                                <Text style={[styles.callToAction]}>
                                    Minimgur
                                </Text>
                            </View>
                            <MKButton {...mkButtonCommonProps} onPress={() => navigator.push({name: 'settings'})}>
                                <Text pointerEvents="none"
                                    style={[{color: 'white', fontWeight: 'bold', textAlign: 'center'}]}>
                                    Settings
                                </Text>
                            </MKButton>
                        </View>

                        <View style={[styles.row, styles.rowSub]}>
                            <MKButton {...mkButtonCommonProps}>
                                <Text pointerEvents="none"
                                    style={[{color: 'white', fontWeight: 'bold', textAlign: 'center'}]}>
                                    CameraRoll
                                </Text>
                            </MKButton>
                        </View>

                        <View style={[styles.row]}>
                            <MKButton {...mkButtonCommonProps} onPress={() => this.showUploader('library')}>
                                <Text pointerEvents="none"
                                    style={[{color: 'white', fontWeight: 'bold', textAlign: 'center'}]}>
                                    Instant Upload from Library
                                </Text>
                            </MKButton>
                            <MKButton {...mkButtonCommonProps} onPress={() => this.showUploader('camera')}>
                                <Text pointerEvents="none"
                                    style={[{color: 'white', fontWeight: 'bold', textAlign: 'center'}]}>
                                    Instant Upload from Camera
                                </Text>
                            </MKButton>
                            {/* <TouchableHighlight style={styles.container} onPress={() => true}>
                                <Text style={styles.callToAction}>
                                    Camera
                                </Text>
                            </TouchableHighlight> */}
                        </View>

                        <View style={[styles.row, styles.rowSub]}>
                            <MKButton {...mkButtonCommonProps} onPress={() => navigator.push('history')}>
                                <Text pointerEvents="none"
                                    style={[{color: 'white', fontWeight: 'bold', textAlign: 'center'}]}>
                                    ShowHistory
                                </Text>
                            </MKButton>
                        </View>
                    </View>
                );
            case 'settings':
                return (
                    <View style={[styles.container]}>
                        <View style={[styles.row]}>
                        </View>
                        <View style={[styles.row]}>
                        </View>
                        <View style={[styles.row]}>
                        </View>
                        <View style={[styles.row]}>
                        </View>
                        <View style={[styles.row]}>
                        </View>
                    </View>
                )
            case 'uploading':
                return (
                    <View style={styles.container}>
                        <ProgressBar styleAttr="Large" />
                    </View>
                );
            case 'results':
                return (
                    <View style={styles.container}>
                        <View style={[styles.row, styles.rowFirst]}>
                            <TouchableHighlight style={styles.rowFirst} onPress={() => navigator.resetTo({name: 'home'})}>
                                <Text style={[styles.callToAction]}>
                                    Minimgur
                                </Text>
                            </TouchableHighlight>
                            <MKButton {...mkButtonCommonProps}>
                                <Text pointerEvents="none"
                                    style={[{color: 'white', fontWeight: 'bold', textAlign: 'center'}]}>
                                    History
                                </Text>
                            </MKButton>
                        </View>

                        <View style={[styles.row]}>
                            <TextInput
                                style={[styles.container, { fontSize: 16}]}
                                onChangeText={(text) => this.setState({text})}
                                multiline={true}
                                editable={true}
                                value={this.state.results}
                            />
                        </View>
                        <View style={[styles.row, styles.rowSub]}>
                            <MKButton {...mkButtonCommonProps} onPress={() => this.copyResultsToClipboard()}>
                                <Text pointerEvents="none"
                                    style={[{color: 'white', fontWeight: 'bold', textAlign: 'center'}]}>
                                    Copy to Clipboard
                                </Text>
                            </MKButton>
                        </View>
                    </View>
                );
            case 'history':
                return (
                    <View></View>
                )
        }
    }

    showUploader(source) {
        const uploadToImgur = this.uploadToImgur;

        switch (source) {
            case 'library':
                ImagePickerManager.launchImageLibrary({}, (response) => onImagePicked(response));
                break;
            case 'camera':
                ImagePickerManager.launchCamera({mediaType: 'photo'}, (response) => onImagePicked(response));
                break;
        }

        function onImagePicked(response) {
            if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            } else if (!response.didCancel) {
                uploadToImgur(response);
            }
        }
    }

    uploadToImgur(imageObject) {
        this.refs.navigator.push({name: 'uploading'});
        const formData = new FormData();
        formData.append('image', imageObject.data);
        fetch('https://api.imgur.com/3/image',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Client-ID ' + CLIENT_ID
                },
                body: formData
            }
        )
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.success) {
                this.setState({
                    results: response.data.link
                }, () => {
                    if (this.state.settings.autoCopyOnUploadSuccess) {
                        this.copyResultsToClipboard();
                    }
                    this.setState(Object.assign({}, this.state, {
                        history: [...this.state.history, {
                            deleteHash: response.data.deletehash,
                            thumbnail: response.data.link.replace(response.data.id, response.data.id + 's'),
                            link: response.data.link,
                        }],
                    }), () => {
                        console.log(this.state.history);
                        try {
                            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state), () => {
                                this.refs.navigator.push({name: 'results'});
                            });
                        } catch (err) {
                            console.error(err);
                        }
                    });                    
                });
            } else {
                console.error(JSON.stringify(response));
            }
        })
        .catch((ex) => console.error(ex));
    }

    copyResultsToClipboard() {
        Clipboard.setString(this.state.results);
        Toast.show('Result URLs have been copied to the clipboard.', Toast.SHORT);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderColor: 'black',
        borderWidth: 3,
        backgroundColor: '#F5FCFF'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    rowFirst: {
        flex: 0,
        height: 54,
    },
    rowSub: {
        flex: 0,
        height: 128,
    },
    callToAction: {
        fontSize: 32,
        textAlign: 'center',
        margin: 10
    },
});

AppRegistry.registerComponent('minimgur', () => minimgur);
