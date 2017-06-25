import React, {
    Component,
    View,
    Text,
} from 'react-native';

import {
    MKButton,
} from 'react-native-material-kit';

import IconEI from 'react-native-vector-icons/EvilIcons';

import {
    styles,
    mkButtonCommonProps,
    mkButtonCommonPropsPrimary,
} from '../styles.js';

export default class HomeButton extends Component {
    static propTypes = {
        style: React.PropTypes.object,
        icons: React.PropTypes.arrayOf(React.PropTypes.string),
        text: React.PropTypes.string.isRequired,
        onPress: React.PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        // <View style={}>

        const mkButtonProps =
            this.props.primary ?
            mkButtonCommonPropsPrimary :
            mkButtonCommonProps;

        return (
            <View style={[styles.homeButtonContainer, this.props.style]}>
                <MKButton {...mkButtonProps}  onPress={this.props.onPress}>
                    <Text style={styles.mkButtonText}>
                        {this.props.icons.map((icon, index) => (
                            <IconEI name={icon} size={64} key={index} />
                        ))}
                    </Text>
                    <Text style={styles.mkButtonText} pointerEvents="none" >
                        {this.props.text}
                    </Text>
                </MKButton>
            </View>
        );
    }
}
