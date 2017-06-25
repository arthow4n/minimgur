import React, {
    Component,
    Linking,
    ListView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    MKButton,
    MKCheckbox,
    MKColor,
} from 'react-native-material-kit';


import XImage from 'react-native-ximage';

import DIC from '../dictionary.config';
import HistoryRowButton from '../components/HistoryRowButton';
import {
    styles,
} from '../styles.js';
import {
    copyToClipboard,
    shareText,
} from '../helpers/share';
const loadingGif = require('../assets/Ajax-loader.gif');

export default class HistoryRow extends Component {
    static propTypes = {
        checkedByDefault: React.PropTypes.bool,
        deleteImage: React.PropTypes.func,
        image: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            link: React.PropTypes.string.isRequired,
            deletehash: React.PropTypes.string.isRequired,
        }).isRequired,
        setSelected: React.PropTypes.func.isRequired, //should be partially applied with image link
    }

    constructor(props) {
        super(props);
    }

    confirmDeleteImage = () => {
        Alert.alert(
            DIC.deleteRemoteImage,
            DIC.deleteRemoteImageDescription + '\n' + image.link,
            [
                {text: DIC.cancel, onPress: () => true, style: 'cancel'},
                {text: DIC.ok, onPress: this.props.deleteImage},
            ],
        );
    }

    render() {
        const image = this.props.image;
        return (
            <View style={styles.rowHistory} key={image.deletehash}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => Linking.openURL(image.link).done()}>
                        <View style={{ height: 96, width: 96 }}>
                            <XImage
                                style={{ height: 96, width: 96 }}
                                defaultSource={loadingGif}
                                url={image.link.replace(image.id, `${image.id}b`)}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.col}>
                        <View style={styles.col}>
                            <Text style={{ textAlign: 'center' }}>{image.link}</Text>
                        </View>
                        <View style={styles.row}>
                            <HistoryRowButton
                                icon="clipboard"
                                onPress={() => copyToClipboard([image.link])}
                            />
                            <HistoryRowButton
                                icon="share-alt"
                                onPress={() => shareText([image.link])}
                            />
                            {(() => {
                                // Hide delete button when HistoryScene used as ResultScene
                                if (!this.props.deleteImage) {
                                    return (
                                        <View style={{flex: 1}} />
                                    );
                                } else {
                                    return (
                                        <HistoryRowButton
                                            color={MKColor.Red}
                                            icon="trash-o"
                                            onPress={this.props.deleteImage}
                                        />
                                    );
                                }
                            })()}
                            <View style={styles.row}>
                                <MKCheckbox
                                    style={{width: 24, height: 24, margin: 12}}
                                    checked={this.props.checkedByDefault}
                                    onCheckedChange={(value) => this.props.setSelected(value.checked)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
