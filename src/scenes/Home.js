import React, {
    Component,
    View,
} from 'react-native';


import DIC from '../dictionary.config';
import HomeButton from '../components/HomeButton';
import {
    styles,
} from '../styles.js';

class HomeScene extends Component {
    static propTypes = {
        getImageFromCamera: React.PropTypes.func.isRequired,
        getImagesFromLibrary: React.PropTypes.func.isRequired,
        pushNavigator: React.PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.scene}>
                <HomeButton
                    icons={['camera']}
                    text={DIC.uploadFromCamera}
                    onPress={() => this.props.getImageFromCamera()}
                    style={{ marginTop: 8 }}
                />
                <HomeButton
                    icons={['image']}
                    text={DIC.uploadFromNativeSelector}
                    onPress={() => this.props.getImagesFromLibrary()}
                />
                <HomeButton
                    icons={['image', 'plus']}
                    text={DIC.uploadFromGallery}
                    onPress={() => this.props.pushNavigator({ name: 'cameraRoll' })}
                />
                <HomeButton
                    icons={['clock']}
                    text={DIC.showHistory}
                    onPress={() => this.props.pushNavigator({ name: 'history' })}
                />
            </View>
        );
    }
}

export default HomeScene;
