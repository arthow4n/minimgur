const APP_VERSION = '1.6.0';
const APP_VERSION_PREVIOUS = '1.5.0';

const IMGUR_API_URL = 'https://api.imgur.com/3/image';
import { CLIENT_ID } from './imgur.config.js'; // Imgur API token

import libAsync from 'async-es';
import numeral from 'numeral';
import debounce from './helpers/debounce';

import UploadScene from './components/scenes/Upload';
import HomeScene from './components/scenes/Home';

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
    ScrollView,
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
    RadioButtonGroup,
    Subheader,
    Toolbar,
} from 'react-native-material-design';

import DIC from './dictionary.config.js';

import Share from 'react-native-share';
import XImage from 'react-native-ximage';
import RNFS from 'react-native-fs';
import FileTransfer from '@remobile/react-native-file-transfer';
import {
    ImagePickerManager,
    RNFileIntent,
 } from 'NativeModules';

import Label from './Label.js';
import CameraRollGallery from './CameraRollGallery.js';

import IconEI from 'react-native-vector-icons/EvilIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';

const loadingGif = require('./Ajax-loader.gif');
const STORAGE_KEY = '@Minimgur:state';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const RENDER_RANGE = Dimensions.get('window').height * 6;
const PARALLEL_UPLOAD_SESSIONS_LIMIT = 3;




export default class minimgur extends Component {
    constructor(props) {
        super(props);
        // use previous version to trigger notification in renderScene()
        this.state = {
          version: APP_VERSION_PREVIOUS,
        };
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', () => {
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
        });
        RNFileIntent.getReceivedFile((response) => this.handleIncomingIntent(response));
    }

    handleIncomingIntent(response) {
        if (Array.isArray(response) && response.length !== 0) {
            this.loadInitialState(() => {
                this.uploadMultipleImages(response);
            });
        } else {
            this.loadInitialState(() => {
                this.refs.navigator.resetTo({name: 'home'});
            });
        }
    }

    loadInitialState(callback) {
        this.loadState((state) => {
            if (err) {
                throw err;
            }
            if (state !== null) {
                this.setState(JSON.parse(state)), () => {
                    if (this.state.options.displayLanguage && this.state.options.displayLanguage !== 'default') {
                        DIC.setLanguage(this.state.options.displayLanguage);
                    }
                    callback();
                });
            } else {
                // the state on clean start
                this.setState({
                    options: {
                        autoCopyOnUploadSuccess: true,
                        useMimeTypeIntentSelector: false,
                        displayLanguage: 'default',
                    },
                    results: [],
                    history: [],
                }), callback);
            }
        });
    }

    loadState(callback) {
        AsyncStorage.getItem(STORAGE_KEY, (err, state) => {
            if (err) {
                throw err;
            }
            if (callback) callback(state);
        });
    }

    saveState(callback) {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state), (err) => {
            if (err) {
                throw err;
            }
            if (callback) callback();
        });
    }

    render() {
        return (
            <Navigator
                ref="navigator"
                initialRoute={{name: 'initializing'}}
                configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottomAndroid}
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
                                        if ( currentRouteName !== 'uploading' &&
                                            currentRouteName !== 'settings' ) {
                                            this.refs.navigator.push({ name: 'settings' });
                                        }
                                    }
                                }]}
                                rightIconStyle={{
                                    margin: 16
                                }}
                            />
                        )
                    }
                })()}
            />
        );
    }

    renderScene = (route, navigator) => {
        // show app version update announcement
        if (this.state.version !== APP_VERSION && route.name !== 'initializing') {
            Alert.alert(
                DIC.newFeature,
                DIC.newFeatureDescription,
                [{
                    text: DIC.ok,
                    onPress: () => {
                        this.setState({
                            version: APP_VERSION_PREVIOUS //current version
                        }), this.saveState);
                    }
                }]
            );
        }
        switch (route.name) {
            case 'initializing':
                return (
                    <View style={styles.container}>
                        <ProgressBar styleAttr="Large" />
                    </View>
                )
            case 'home':
                return (
                    <HomeScene
                        pushNavigator={deboune(() => {
                            navigator.push(route);
                        })}
                        getImageFromCamera={this.getImageFromCamera}
                        getImagesFromLibrary={this.getImagesFromLibrary}
                    />
                )
            case 'settings':
                const optionCheckBoxItems = [
                    {
                        value: 'autoCopyOnUploadSuccess', label: DIC.automaticallyCopyResultURLs
                    },
                    {
                        value: 'useMimeTypeIntentSelector', label: DIC.useMIMETypeSelector
                    },
                ];
                return (
                    <ScrollView style={[styles.scene]}>
                        <View>
                            <Subheader text={DIC.options} />
                            <CheckboxGroup
                                primary="paperTeal"
                                checked={Object.keys(this.state.options).filter((k) => this.state.options[k])}
                                onSelect={(selected) => {
                                    const newOptions = this.state.options;
                                    optionCheckBoxItems.forEach( (item) => {
                                        const key = item.value;
                                        newOptions[key] = selected.indexOf(key) !== -1;
                                    });
                                    this.setState(Object.assign({}, this.state, {
                                        options: newOptions,
                                    }), this.saveState);
                                }}
                                items={optionCheckBoxItems}
                            />
                        </View>
                        <View>
                            <Subheader text={DIC.displayLanguage} />
                            <RadioButtonGroup
                                primary="paperTeal"
                                selected={this.state.options.displayLanguage || 'default'}
                                items={[{
                                    value: 'default', label: DIC.systemLocale
                                }, {
                                    value: 'en', label: 'English'
                                }, {
                                    value: 'zh', label: '繁體中文'
                                }]}
                                onSelect={(selected) => {
                                    const originalLanguage = this.state.options.displayLanguage;
                                    const newOptions = this.state.options;
                                    newOptions.displayLanguage = selected;
                                    this.setState(Object.assign({}, this.state, {
                                        options: newOptions,
                                    }), () => {
                                        this.saveState(() => {
                                            if (selected !== originalLanguage) {
                                                if (selected === 'default') {
                                                    DIC.setLanguage(DIC.getInterfaceLanguage());
                                                    this.setState(this.state);
                                                } else {
                                                    DIC.setLanguage(selected);
                                                    this.setState(this.state);
                                                }
                                            }
                                        });
                                    });
                                }}
                            />
                        </View>
                        <View>
                            <Subheader text={DIC.operations} />
                            <Label label={DIC.clearLocalUploadHistory} onPress={() => {
                                Alert.alert(
                                    DIC.clearLocalUploadHistoryPrompt,
                                    DIC.clearLocalUploadHistoryDescription,
                                    [
                                        {text: 'Cancel', onPress: () => true, style: 'cancel'},
                                        {text: 'OK', onPress: () => {
                                            navigator.push({ name: 'initializing'});
                                            this.setState(Object.assign({}, this.state, {
                                                results: [],
                                                history: [],
                                            }), () => {
                                                this.saveState(() => {
                                                    Toast.show(DIC.clearedLocalHistory, Toast.SHORT);
                                                    navigator.pop();
                                                });
                                            });
                                        }},
                                    ]
                                )
                            }} eiIcon="trash"/>
                        </View>
                        <View>
                            <Subheader text={DIC.about} />
                            <Label label={ DIC.githubRepository + ": arthow4n/minimgur"} onPress={() => {
                                Linking.openURL('https://github.com/arthow4n/minimgur').done();
                            }} eiIcon="sc-github"/>
                        </View>
                    </ScrollView>
                )
            case 'cameraRoll':
                return (
                    <View style={styles.scene}>
                        <CameraRollGallery onUpload={(imageURIs) =>{
                            if (imageURIs.length === 0) {
                                Toast.show(DIC.selectAtLeastOneImageToUpload, Toast.SHORT);
                                return true;
                            }
                            this.uploadMultipleImages(imageURIs.map((uri) => {
                                return { uri: uri, fileName: '' };
                            }));
                        }}/>
                    </View>
                );
            case 'uploading':
                return (
                    <UploadScene
                        filename={route.fileName}
                        uploadProgress={this.state.uploadProgress}
                        uploadProgressTotal={this.state.uploadProgressTotal}
                        uploadFilesCount={this.route.uploadFilesCount}
                        uploadFilesTotal={this.route.uploadFilesTotal}
                    />
                );
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
    };

    getImagesFromLibrary = () => {
        this.setState({
            results: [],
        }, () => {
            if (this.state.options.useMimeTypeIntentSelector) {
                RNFileIntent.requestFile("image/*", (response) => {
                    if (!response.didCancel) {
                        this.uploadMultipleImages([response]);
                    }
                });
            } else {
                ImagePickerManager.launchImageLibrary({}, (response) => {
                    if (!response.didCancel) {
                      this.uploadMultipleImages([response]);
                    }
                });
            }
        });
    }

    getImageFromCamera = () => {
        this.setState({
            results: [],
        }, () => {
            ImagePickerManager.launchCamera({mediaType: 'photo'}, (response) => {
                if (!response.didCancel) {
                    this.uploadMultipleImages([response]);
                }
            });
        });
    }

    uploadMultipleImages = (images) => {
        this.setState({
            uploadProgress: 0,
            uploadProgressTotal: 0,
        }, () => {
            libAsync.mapLimit(images, 10, (image, resolve) => {
                if (typeof image.fileSize !== 'undefined') {
                    image.fileSize = parseInt(image.fileSize);
                    resolve(null, image);
                } else {
                    RNFileIntent.queryFileStat(image.uri, (response) => {
                        response.fileSize = parseInt(response.fileSize);
                        resolve(null, response);
                    });
                }
            }, (err, images) => {
                images = images.map((image, i) => {
                    return {
                        ...image,
                        order: i,
                    };
                });
                this.setState({
                    uploadProgressTotal: images.reduce( (prev, curr) => {
                        return prev + curr.fileSize;
                    }, 0),
                }, () => {
                    const progress = new Array(images.length).fill(0);
                    const total = images.length;
                    let current = 0;
                    this.refs.navigator.replace({
                        name: 'uploading',
                        uploadFilesCount: current,
                        uploadFilesTotal: total,
                        fileName: false,
                    });
                    libAsync.mapLimit(images, PARALLEL_UPLOAD_SESSIONS_LIMIT, (image, resolve) => {
                        const fileTransfer = new FileTransfer();
                        fileTransfer.onprogress = (progressEvent) => {
                            progress[image.order] = progressEvent.loaded;
                            const newProgress = progress.reduce((prev, curr) => prev + curr);
                            this.setState({
                                uploadProgress: (newProgress < this.state.uploadProgressTotal ? newProgress : this.state.uploadProgressTotal),
                            });
                        };
                        fileTransfer.upload(image.uri, IMGUR_API_URL,
                            (result) => {
                                response = JSON.parse(result.response);
                                current += 1;
                                this.refs.navigator.replace({
                                    name: 'uploading',
                                    uploadFilesCount: current,
                                    uploadFilesTotal: total,
                                    fileName: false,
                                });
                                if (response.success) {
                                const result = {
                                deletehash: response.data.deletehash,
                                id: response.data.id,
                                link: response.data.link.replace('http://', 'https://'),
                                };
                                resolve(null, result);
                                } else {
                                Toast.show(DIC.failedToUploadSelectedImage, Toast.SHORT);
                                // handle occured error in main callback instead of mapLimit itself,
                                // otherwise mapLimit will immediately ignore rest pending async actions and call the main callback.
                                resolve(null, false);
                                }
                            },
                            // fileTransfer() error handle
                            (err) => {
                                progress[image.order] = image.fileSize;
                                this.setState({
                                    uploadProgress: progress.reduce((prev, curr) => prev + curr)
                                });
                                Toast.show(DIC.failedToUploadSelectedImage, Toast.SHORT);
                                // handle occured error in main callback instead of mapLimit itself,
                                // otherwise mapLimit will immediately ignore rest pending async actions and call the main callback.
                                resolve(null, false);
                            },
                            // fileTransfer() options
                            {
                                fileKey: 'image',
                                fileName: image.fileName || 'tempFileName',
                                mimeType: image.type,
                                headers: {
                                    Authorization: 'Client-ID ' + CLIENT_ID
                                },
                            }
                        );
                    }, (err, results) => {
                        // filter failed requests
                        const filteredResults = results.filter((result) => result);
                        if (filteredResults.length === 0) {
                            Toast.show(DIC.allUploadActionsAreFailed, Toast.SHORT);
                            this.refs.navigator.resetTo({name: 'home'});
                        } else {
                            this.setState({
                                results: filteredResults,
                                history: filteredResults.concat(this.state.history),
                            }), () => {
                                this.saveState(() => {
                                    this.refs.navigator.push({name: 'results'});
                                    if (this.state.options.autoCopyOnUploadSuccess) {
                                        this.copyResultsToClipboard(results.map((image) => image.link));
                                    }
                                    if (results.length !== filteredResults.length) {
                                        Toast.show( (results.length - filteredResults.length) + ' ' + DIC.numUploadActionsAreFailed, Toast.SHORT);
                                    }
                                });
                            });
                        }
                    });
                });
            });
        });
    }

    renderHistory(history, isResults) {
        const ds =
          new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 })
          .cloneWithRows(history);
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
                        pageSize={24}
                        scrollRenderAheadDistance={RENDER_RANGE}
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
                                                <XImage defaultSource={loadingGif} url={image.link.replace(image.id, `${image.id}b`)} style={{ height: 96, width: 96 }} />
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
                                                                        DIC.deleteRemoteImage,
                                                                        DIC.deleteRemoteImageDescription + '\n' + image.link,
                                                                        [
                                                                            {text: DIC.cancel, onPress: () => true, style: 'cancel'},
                                                                            {text: DIC.ok, onPress: () => {
                                                                                Toast.show(DIC.deletingRemoteImage + image.link, Toast.SHORT);
                                                                                fetch(`${IMGUR_API_URL}/${image.deletehash}`, {
                                                                                    method: 'DELETE',
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
                                                                                        }), this.saveState);
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
                            <IconFA name="clipboard" size={24} /> {DIC.copySelectedURLs}
                        </Text>
                    </MKButton>
                    <MKButton {...mkButtonCommonPropsPrimary} flex={0} width={56} backgroundColor={MKColor.Teal} onPress={() => {
                            Share.open({
                                share_text: selectedURLs.join('\n'),
                            }, (e) => console.log(e));
                        }}>
                        <Text pointerEvents="none"
                            style={[styles.mkButtonTextPrimary, { fontSize: 16 }]}>
                            <IconFA name="share-alt" size={24} />
                        </Text>
                    </MKButton>
                </View>
            </View>
        )
    }

    copyResultsToClipboard(arrayOfURLs) {
        Clipboard.setString(arrayOfURLs.join('\n'));
        Toast.show(DIC.copiedSelectedURLsToClipboard, Toast.SHORT);
    }
}
