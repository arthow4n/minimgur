import React, {
    Alert,
    AppRegistry,
    AsyncStorage,
    BackAndroid,
    CameraRoll,
    Clipboard,
    Component,
    Dimensions,
    Linking,
    ListView,
    Navigator,
    ProgressBarAndroid as ProgressBar,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid as Toast,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';


import {
    MKButton,
    MKCheckbox,
    MKColor,
    MKTextField,
} from 'react-native-material-kit';

import {
    Card,
    CheckboxGroup,
    Subheader,
    Toolbar,
} from 'react-native-material-design';

import { ImagePickerManager } from 'NativeModules';
import Share from 'react-native-share';
import XImage from 'react-native-ximage';
import RNFS from 'react-native-fs';

import Label from './Label.js';
import CameraRollGallery from './CameraRollGallery.js';

import { CLIENT_ID } from './imgur.config.js';

import IconEI from 'react-native-vector-icons/EvilIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';

const STORAGE_KEY = '@Minimgur:state';

const mkButtonCommonProps = {
    backgroundColor: MKColor.Silver,
    rippleColor: 'rgba(128,128,128,0.2)',
    maskColor: 'rgba(128,128,128,0.15)',
    flex: 1,
    borderColor: 'rgba(0,0,0,.1)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'stretch',
    shadowRadius: 2,
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.7,
    shadowColor: 'black',
};

const mkButtonCommonPropsPrimary = Object.assign({}, mkButtonCommonProps, {
    rippleColor: 'rgba(255,255,255,0.2)',
    maskColor: 'rgba(255,255,255,0.15)',
})

class minimgur extends Component {

    constructor(props) {
        super(props);
        this.renderScene = this.renderScene.bind(this);
        this.uploadMultipleImages = this.uploadMultipleImages.bind(this);
        this.uploadToImgur = this.uploadToImgur.bind(this);
        this.copyResultsToClipboard = this.copyResultsToClipboard.bind(this);
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
                    options: {
                        autoCopyOnUploadSuccess: true,
                    },
                    results: [],
                    history: [],
                });
            }
        } catch (error) {
            console.error(error);
        }
        this.refs.navigator.resetTo({name: 'home'});
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', function() {
            const currentRouteName = this.refs.navigator.getCurrentRoutes().slice(-1)[0].name;
            switch (currentRouteName) {
                case 'home':
                    BackAndroid.exitApp();
                    break;
                case 'results':
                    this.setState(Object.assign({}, this.state, {
                        results: [],
                    }));
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
                navigationBar={(() => {
                    if (!this.state.fullScreen) {
                        return (
                            <Toolbar
                                title="Minimgur"
                                primary="paperTeal"
                                icon="home"
                                onIconPress={() => {
                                    this.refs.navigator.resetTo({name: 'home'});
                                }}
                                actions={[{
                                    icon: 'settings',
                                    onPress: () => {
                                        const currentRouteName = this.refs.navigator.getCurrentRoutes().slice(-1)[0].name;
                                        console.log(this.refs.navigator.getCurrentRoutes().slice(-1)[0].name);
                                        if ( currentRouteName !== 'uploading' &&
                                            currentRouteName !== 'settings' ) {
                                            this.refs.navigator.push({ name: 'settings' });
                                        }
                                    }
                                }]}
                                rightIconStyle={{
                                    margin: 10
                                }}
                            />
                        )
                    }
                })()}
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
                    <View style={styles.scene}>
                        <View style={[styles.homeButtonContainer, { marginTop: 8 }]}>
                            <MKButton {...mkButtonCommonProps}  onPress={() => this.showUploader('camera')}>
                                <Text style={styles.mkButtonText}>
                                    <IconEI name="camera" size={64} />
                                </Text>
                                <Text pointerEvents="none"
                                    style={styles.mkButtonText}>
                                    Upload from Camera Shot
                                </Text>
                            </MKButton>
                        </View>
                        <View style={styles.homeButtonContainer}>
                            <MKButton {...mkButtonCommonProps} onPress={() => this.showUploader('library')}>
                                <Text style={styles.mkButtonText}>
                                    <IconEI name="image" size={64} />
                                </Text>
                                <Text pointerEvents="none"
                                    style={styles.mkButtonText}>
                                    Upload from Native Selector
                                </Text>
                            </MKButton>
                        </View>
                        <View style={styles.homeButtonContainer}>
                            <MKButton {...mkButtonCommonPropsPrimary} backgroundColor={MKColor.Indigo} onPress={() => navigator.push({ name: 'cameraRoll' })}>
                                <Text style={styles.mkButtonTextPrimary} >
                                    <IconEI name="image" size={64} />
                                    <IconEI name="plus" size={64} />
                                </Text>
                                <Text pointerEvents="none"
                                    style={styles.mkButtonTextPrimary}>
                                    Select from Recent Images
                                </Text>
                            </MKButton>
                        </View>
                        <View style={styles.homeButtonContainer}>
                            <MKButton {...mkButtonCommonProps} onPress={() => navigator.push({ name: 'history' })}>
                                <Text style={styles.mkButtonText}>
                                    <IconEI name="clock" size={64} />
                                </Text>
                                <Text pointerEvents="none"
                                    style={styles.mkButtonText}>
                                    Show History
                                </Text>
                            </MKButton>
                        </View>
                    </View>
                );
            case 'settings':
                return (
                    <View style={[styles.scene]}>
                        <View>
                            <Subheader text="Options" />
                            <CheckboxGroup
                                primary="paperTeal"
                                checked={Object.keys(this.state.options).filter((k) => this.state.options[k])}
                                onSelect={(selected) => {
                                    const newOptions = {};
                                    for (var key in this.state.options) {
                                        newOptions[key] = selected.indexOf(key) !== -1;
                                    }
                                    this.setState(Object.assign({}, this.state, {
                                        options: newOptions,
                                    }), () => {
                                        try {
                                            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
                                        } catch (err) {
                                            console.error(err);
                                        }
                                    });
                                }}
                                items={[{
                                    value: 'autoCopyOnUploadSuccess', label: 'Automatically copy the result URLs'
                                }]}
                            />
                        </View>
                        <View>
                            <Subheader text="Operations" />
                            <Label label="Clear local upload history" onPress={() => {
                                return true;
                            }} eiIcon="trash"/>
                        </View>
                        <View>
                            <Subheader text="About" />
                            <Label label="Github repository: arthow4n/minimgur" onPress={() => {
                                Linking.openURL('https://github.com/arthow4n/minimgur').done();
                            }} eiIcon="sc-github"/>
                        </View>
                    </View>
                )
            case 'cameraRoll':
                return (
                    <View style={styles.scene}>
                        <CameraRollGallery onUpload={(imageURIs) =>{
                            if (imageURIs.length === 0) {
                                Toast.show('Select at least 1 image to upload.', Toast.SHORT);
                                return true;
                            }
                            this.uploadMultipleImages(imageURIs);
                        }}/>
                    </View>
                );
            case 'uploading':
                return this.renderUpload(route);
            case 'results':
                return this.renderHistory(this.state.results, true);
            case 'history':
                return this.renderHistory(this.state.history);
            case 'showImage':
                const { width, height } = Dimensions.get('window');
                return (
                    <View>
                        <XImage url={route.url} style={{ height, width }} />
                    </View>
                );
        }
    }

    renderUpload(route) {
        return (
            <View style={styles.scene}>
                <View style={styles.container}>
                    <Text style={{textAlign: 'center', margin: 16, fontSize: 18}}>{route.fileName}</Text>
                    <ProgressBar styleAttr="Large" />
                    <Text style={{textAlign: 'center', margin: 16}}>{(`Uploaded image [${route.current}/${route.total}]`)}</Text>
                </View>
            </View>
        );
    }

    showUploader(source) {
        this.setState(Object.assign({}, this.state, {
            results: [],
        }));
        switch (source) {
            case 'library':
                ImagePickerManager.launchImageLibrary({}, (response) => this.onUploaderImagePicked(response));
                break;
            case 'camera':
                ImagePickerManager.launchCamera({mediaType: 'photo'}, (response) => this.onUploaderImagePicked(response));
                break;
        }
    }

    uploadMultipleImages(imageURIs) {
        this.setState(Object.assign({}, this.state, {
            results: [],
        }));
        const total = imageURIs.length;
        let current = 0;
        imageURIs.forEach((uri, i) => {
            this.refs.navigator.replace({
                name: 'uploading',
                current,
                total,
                fileName: 'Uploading Multiple Images',
            })
            RNFS.readFile(uri.replace('file:/', ''), 'base64')
            .then((data) => {
                this.uploadToImgur({ data })
                .then((response) => {
                    current += 1;
                    this.refs.navigator.replace({
                        name: 'uploading',
                        current,
                        total,
                        fileName: 'Uploading Multiple Images',
                    });
                    if (response.success) {
                        const result = {
                            deletehash: response.data.deletehash,
                            id: response.data.id,
                            link: response.data.link.replace('http://', 'https://'),
                        };
                        const newResults = this.state.results;
                        newResults[i] = result;
                        this.setState(Object.assign({}, this.state, {
                            results: newResults,
                            history: [result, ...this.state.history],
                        }), () => {
                            try {
                                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state), () => {
                                    if (current === total) {
                                        if (this.state.options.autoCopyOnUploadSuccess) {
                                            this.copyResultsToClipboard(this.state.results.map((image) => image.link));
                                        }
                                        this.refs.navigator.push({name: 'results'});
                                    }
                                });
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    } else {
                        const err = JSON.stringify(response)
                        console.error(err);
                    }
                });
            })
            .catch((ex) => console.error(ex));
        });
    }

    onUploaderImagePicked(response) {
        if (response.error) {
            console.log('ImagePickerManager Error: ', response.error);
        } else if (!response.didCancel) {
            if (this.refs.navigator.getCurrentRoutes().slice(-1)[0].name !== 'uploading') {
                this.refs.navigator.push({
                    name: 'uploading',
                    current: 1,
                    total: 1,
                    fileName: response.fileName,
                });
            }
            this.uploadToImgur(response)
            .then((response) => {
                if (response.success) {
                    const result = {
                        deletehash: response.data.deletehash,
                        id: response.data.id,
                        link: response.data.link.replace('http://', 'https://'),
                    };
                    this.setState(Object.assign({}, this.state, {
                        results: [result, ...this.state.results]
                    }), () => {
                        if (this.state.options.autoCopyOnUploadSuccess) {
                            this.copyResultsToClipboard(this.state.results.map((image) => image.link));
                        }
                        this.setState(Object.assign({}, this.state, {
                            history: [result, ...this.state.history],
                        }), () => {
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
    }

    uploadToImgur(imageObject) {
        return new Promise((resolve, reject) => {
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
                resolve(response);
            })
            .catch((ex) => reject(ex));
        })
    }

    renderHistory(history, isResults) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
        ds = ds.cloneWithRows(history);
        let selectedURLs = [];
        if (isResults) {
            history.forEach((image) => {
                selectedURLs.push(image.link)
            });
        }
        return (
            <View style={styles.scene}>
                <View style={styles.row}>
                    <ListView dataSource={ds}
                        initialListSize={12}
                        renderSeparator={(sectionId, rowId) => {
                            return (
                                <View style={{ height: 1, backgroundColor: '#EAEAEA' }} key={`${sectionId}-${rowId}`}></View>
                            )
                        }}
                        renderRow={(image) => {
                            return (
                                <View style={styles.rowHistory} key={image.deletehash}>
                                    <View style={styles.row}>
                                        <TouchableOpacity onPress={() => {
                                            Linking.openURL(image.link).done();
                                        }}>
                                            <View style={{ height: 96, width: 96 }}>
                                                <XImage url={image.link.replace(image.id, `${image.id}b`)} style={{ height: 96, width: 96 }} />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.col}>
                                            <View style={styles.col}>
                                                <Text style={{ textAlign: 'center' }}>{image.link}</Text>
                                            </View>
                                            <View style={styles.row}>
                                                <MKButton {...mkButtonCommonProps}
                                                    onPress={() => {
                                                        this.copyResultsToClipboard([image.link]);
                                                    }}>
                                                    <Text pointerEvents="none"
                                                        style={[styles.mkButtonText]}>
                                                        <IconFA name="clipboard" size={24} />
                                                    </Text>
                                                </MKButton>
                                                <MKButton {...mkButtonCommonProps} onPress={() => {
                                                        Share.open({
                                                            share_URL: image.link,
                                                        }, (e) => console.log(e));
                                                    }}>
                                                    <Text pointerEvents="none"
                                                        style={[styles.mkButtonText]}>
                                                        <IconFA name="share-alt" size={24} />
                                                    </Text>
                                                </MKButton>
                                                {(() => {
                                                    if (isResults) {
                                                        return (
                                                            <View style={{flex: 1}} />
                                                        )
                                                    } else {
                                                        return (
                                                            <MKButton {...mkButtonCommonProps} onPress={() => {
                                                                    Alert.alert(
                                                                        'Delete Remote Image',
                                                                        `Are you sure to delete image: \n${image.link}?`,
                                                                        [
                                                                            {text: 'Cancel', onPress: () => true, style: 'cancel'},
                                                                            {text: 'OK', onPress: () => {
                                                                                Toast.show(`Deleting ${image.link}`, Toast.SHORT);
                                                                                fetch('https://api.imgur.com/3/image/' + image.deletehash, {
                                                                                    method: 'POST',
                                                                                    headers: {
                                                                                        Authorization: 'Client-ID ' + CLIENT_ID
                                                                                    },
                                                                                })
                                                                                .then((response) => response.json())
                                                                                .then((response) => {
                                                                                    if (response.success) {
                                                                                        this.setState(Object.assign({}, this.state, {
                                                                                            history: this.state.history.filter((historyImage) => {
                                                                                                return historyImage.deletehash !== image.deletehash;
                                                                                            })
                                                                                        }), () => {
                                                                                            try {
                                                                                                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
                                                                                            } catch (err) {
                                                                                                console.error(err);
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                })
                                                                                .catch((ex) => console.error(ex));
                                                                            }},
                                                                        ]
                                                                    )}}>
                                                                    <Text pointerEvents="none"
                                                                        style={[styles.mkButtonText, { color: MKColor.Red }]}>
                                                                        <IconFA name="trash-o" size={24} />
                                                                    </Text>
                                                                </MKButton>
                                                        )
                                                    }
                                                })()}
                                                <View style={styles.row}>
                                                    <MKCheckbox style={{width: 24, height: 24, margin: 12}} checked={isResults} onCheckedChange={(v) => {
                                                            if (v.checked) {
                                                                selectedURLs.push(image.link);
                                                            } else {
                                                                selectedURLs = selectedURLs.filter((url) => url !== image.link);
                                                            }
                                                    }}/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                    }} />
                </View>
                <View style={[styles.row, styles.rowButton]}>
                    <MKButton {...mkButtonCommonPropsPrimary} backgroundColor={MKColor.Indigo} onPress={() => {
                            this.copyResultsToClipboard(selectedURLs);
                        }}>
                        <Text pointerEvents="none"
                            style={[styles.mkButtonTextPrimary, { fontSize: 16 }]}>
                            Copy Selected URLs to Clipboard
                        </Text>
                    </MKButton>
                </View>
            </View>
        )
    }

    copyResultsToClipboard(arrayOfURLs) {
        Clipboard.setString(arrayOfURLs.join('\n'));
        Toast.show('Selected URL(s) have been copied to the clipboard.', Toast.SHORT);
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        marginTop: 56,
    },
    homeButtonContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 2,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8,
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    rowButton: {
        flex: 0,
        height: 56,
    },
    rowHistory: {
        flex: 0,
        height: 90,
    },
    mkButtonText: {
        color: MKColor.Teal,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    mkButtonTextPrimary: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

AppRegistry.registerComponent('minimgur', () => minimgur);
