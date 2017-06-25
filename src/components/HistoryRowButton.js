import React, {
    Component,
    Text,
} from 'react-native';

import {
    MKButton,
} from 'react-native-material-kit';

import IconFA from 'react-native-vector-icons/FontAwesome';

import {
    mkButtonCommonProps,
    styles,
} from '../styles.js';

export default class HistoryRowButton extends Component {
    static propTypes = {
        color: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        onPress: React.PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        const buttonStyle = [styles.mkButtonText];
        if (this.props.color) {
            buttonStyle.push({
                color: this.props.color,
            });
        }

        return (
            <MKButton
                {...mkButtonCommonProps}
                onPress={this.props.onPress}
            >
                <Text
                    pointerEvents="none"
                    style={buttonStyle}
                >
                    <IconFA name={this.props.icon} size={24} />
                </Text>
            </MKButton>
        )
    }
}
