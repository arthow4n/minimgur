import React, {
    Component,
    Text,
    View,
} from 'react-native';

import {
    MKButton,
    MKColor,
} from 'react-native-material-kit';


import IconFA from 'react-native-vector-icons/FontAwesome';

import DIC from '../dictionary.config';
import {
    mkButtonCommonPropsPrimary,
    styles,
} from '../styles.js';
import {
    copyToClipboard,
    shareText,
} from '../helpers/share';

export default class HistoryConrolls extends Component {
    static propTypes = {
        selectedUrls: React.PropTypes.array.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.row, styles.rowButton]}>
                <MKButton
                    {...mkButtonCommonPropsPrimary}
                    onPress={() => copyToClipboard(this.props.selectedUrls)}
                >
                    <Text
                        pointerEvents="none"
                        style={[styles.mkButtonTextPrimary, { fontSize: 16 }]}
                    >
                        <IconFA name="clipboard" size={24} />
                        {DIC.copySelectedURLs}
                    </Text>
                </MKButton>
                <MKButton
                    {...mkButtonCommonPropsPrimary}
                    flex={0}
                    width={56}
                    backgroundColor={MKColor.Teal}
                    onPress={() => shareText(this.props.selectedUrls)}
                >
                    <Text
                        pointerEvents="none"
                        style={[styles.mkButtonTextPrimary, { fontSize: 16 }]}
                    >
                        <IconFA name="share-alt" size={24} />
                    </Text>
                </MKButton>
            </View>
        )
    }
}
