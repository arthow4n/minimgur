import React, {
    Component,
    ProgressBarAndroid as ProgressBar,
    View,
} from 'react-native';

import {
    styles,
} from '../styles';

export default class InitializingScene extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <ProgressBar styleAttr="Large" />
            </View>
        );
    }
}
