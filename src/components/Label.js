/**
 * Derived from Checkbox of 'react-native-material-design'
 */

import React, { Component, StyleSheet, PropTypes, Text, View, TouchableHighlight } from 'react-native';
import { TYPO, PRIMARY, COLOR, PRIMARY_COLORS, THEME_NAME } from '../../node_modules/react-native-material-design/lib/config.js';
import IconEI from 'react-native-vector-icons/EvilIcons';

const typos = StyleSheet.create(TYPO);

export default class Label extends Component {

    static propTypes = {
        label: React.PropTypes.string.isRequired,
        theme: React.PropTypes.oneOf(THEME_NAME),
        primary: React.PropTypes.oneOf(PRIMARY_COLORS),
        eiIcon: React.PropTypes.string.isRequired,
    };

    static defaultProps = {
        theme: 'light',
        primary: PRIMARY,
    };

    render() {
        const { theme, primary, checked, disabled, value, onCheck } = this.props;

        const status = (()=> {
            if (disabled) {
                return 'disabled'
            } else if (checked) {
                return 'checked'
            } else {
                return 'default'
            }
        })();

        const colorMap = {
            light: {
                disabled: '#000000',
                checked: COLOR[`${primary}500`].color,
                default: '#000000'
            },
            dark: {
                disabled: '#ffffff',
                checked: COLOR[`${primary}500`].color,
                default: '#ffffff'
            }
        };

        const opacityMap = {
            light: {
                checked: 1,
                default: 0.54,
                disabled: 0.26
            },
            dark: {
                checked: 1,
                default: 0.7,
                disabled: 0.3
            }
        };

        const underlayMap = {
            light: 'rgba(0,0,0,.12)',
            dark: 'rgba(255,255,255,.12)'
        }

        const labelColorMap = {
            light: '#000000',
            dark: '#ffffff'
        };

        const CURR_COLOR = colorMap[theme][status];
        const OPACITY = opacityMap[theme][status];
        const LABEL_COLOR = labelColorMap[theme];
        const UNDERLAY_COLOR = underlayMap[theme];

        return (
            <TouchableHighlight
                onPress={this.props.onPress}
                underlayColor={disabled ? 'rgba(0,0,0,0)' : UNDERLAY_COLOR}
                activeOpacity={1}
            >
                <View style={styles.container}>
                    <View style={{ margin: 16}}>
                        <IconEI name={this.props.eiIcon} size={32}/>
                    </View>
                    <View>
                        <Text
                            style={[
                                typos.paperFontBody1,
                                styles.label,
                                COLOR[`${theme}PrimaryOpacity`],
                                disabled && COLOR[`${theme}DisabledOpacity`], {
                                    color: LABEL_COLOR
                                }, {
                                    flex: 1
                                }
                            ]}
                        >
                            {this.props.label}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    label: {
        margin: 16,
        opacity: COLOR.darkPrimaryOpacity.opacity,
        flex: 1
    }
});
