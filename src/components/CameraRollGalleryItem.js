import React, {
    Component,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    CameraRollGalleryItemStyles as styles,
} from '../styles';

export default class CameraRollGalleryItem extends Component {
    static propTypes = {
        imageSrc: React.PropTypes.string.isRequired,
        onPress: React.PropTypes.func.isRequired,
        selectedIndex: React.PropTypes.number.isRequired, // -1 stands for unselected
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View>
                    <Image style={styles.image} source={{ uri: this.props.imageSrc }} />
                </View>
                {(() => {
                    if (this.props.selectedIndex !== -1) {
                        return (
                            <View style={[styles.imageGrid, styles.imageBadge]}>
                                <Text style={styles.mkButtonTextPrimary}>
                                    { this.props.selectedIndex + 1 }
                                </Text>
                            </View>
                        );
                    }
                })()}
                {(() => {
                    if (this.props.selectedIndex !== -1) {
                        return (
                            <View style={[styles.imageBorder]} />
                        );
                    }
                })()}
            </TouchableOpacity>
        )
    }
}
