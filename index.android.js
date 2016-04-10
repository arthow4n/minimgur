import React, {
    AppRegistry,
    Clipboard,
    Component,
    Navigator,
    ProgressBarAndroid as ProgressBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

import { CLIENT_ID } from './imgur.config.js';

import { ImagePickerManager } from 'NativeModules';

class minimgur extends Component {
    constructor(props) {
        super(props);
        this.renderScene = this.renderScene.bind(this);
        this._setClipboardContent = this._setClipboardContent.bind(this);
        this.uploadToImgur = this.uploadToImgur.bind(this);
        this.state = {
            result: ''
        };
    }

    render() {
        return (
            <Navigator
                ref="navigator"
                initialRoute={{name: 'home'}}
                renderScene={this.renderScene}
            />
        );
    }

    renderScene(route, navigator) {
        switch (route.name) {
            case 'home':
                return (
                    <TouchableHighlight style={styles.container} onPress={() => this.showUploader()}>
                        <View style={styles.container}>
                            <Text style={styles.callToAction}>
                                Upload to Imgur!
                            </Text>
                        </View>
                    </TouchableHighlight>
                );
            case 'uploading':
                return (
                    <View style={styles.container}>
                        <ProgressBar styleAttr="Large" />
                    </View>
                );
            case 'results':
                return (
                    <View style={styles.container}>
                        <Text>Result URL have been copied to the clipboard.</Text>
                        <Text>{this.state.result}</Text>
                    </View>
                );
        }
    }

    showUploader() {
        ImagePickerManager.launchImageLibrary({}, (response)  => {
            this.uploadToImgur(response);
        });
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
            this.setState({
                result: response.data.link
            });
            Clipboard.setString(response.data.link);
            this.refs.navigator.push({name: 'results'});
        })
        .catch((ex) => console.log(ex));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    callToAction: {
        fontSize: 48,
        textAlign: 'center',
        margin: 10
    },
});

AppRegistry.registerComponent('minimgur', () => minimgur);
