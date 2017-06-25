import React, {
    Alert,
    Component,
    View,
    ScrollView,
} from 'react-native';
import {
    Card,
    CheckboxGroup,
    RadioButtonGroup,
    Subheader,
    Toolbar,
} from 'react-native-material-design';


import Label from '../components/Label';
import DIC from '../dictionary.config';
import {
    styles,
} from '../styles.js';

class SettingsScene extends Component {
    static propTypes = {
        clearHistory: React.PropTypes.func.isRequired,
        setOptions: React.PropTypes.func.isRequired,
        setUILanguage: React.PropTypes.func.isRequired,
        options: React.PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const optionCheckBoxItems = [
            {
                value: 'autoCopyOnUploadSuccess',
                label: DIC.automaticallyCopyResultURLs,
            },
            {
                value: 'useMimeTypeIntentSelector',
                label: DIC.useMIMETypeSelector,
            },
        ];
        return (
            <ScrollView style={[styles.scene]}>
                <View>
                    <Subheader text={DIC.options} />
                    <CheckboxGroup
                        primary="paperTeal"
                        items={optionCheckBoxItems}
                        checked={
                            Object
                                .keys(this.props.options)
                                .filter((k) => this.props.options[k])
                        }
                        onSelect={(selected) => {
                            this.props.setOptions(
                                Object.assign.apply(null, [
                                    ...optionCheckBoxItems.map((item) => ({
                                        [item.value]: selected.indexOf(item.value) !== -1,
                                    })),
                                ])
                            );
                        }}
                    />
                </View>
                <View>
                    <Subheader text={DIC.displayLanguage} />
                    <RadioButtonGroup
                        primary="paperTeal"
                        selected={this.props.options.displayLanguage || 'default'}
                        items={[{
                            value: 'default',
                            label: DIC.systemLocale,
                        }, {
                            value: 'en',
                            label: 'English',
                        }, {
                            value: 'zh',
                            label: '繁體中文',
                        }]}
                        onSelect={(selected) => {
                            const originalLanguage = this.props.options.displayLanguage;
                            if (selected === originalLanguage) return;
                            this.props.setOptions({
                                displayLanguage: selected,
                            }, () => {
                                this.props.setUILanguage(selected);
                            });
                        }}
                    />
                </View>
                <View>
                    <Subheader text={DIC.operations} />
                    <Label
                        eiIcon="trash"
                        label={DIC.clearLocalUploadHistory}
                        onPress={() => {
                            Alert.alert(
                                DIC.clearLocalUploadHistoryPrompt,
                                DIC.clearLocalUploadHistoryDescription,
                                [
                                    {text: 'Cancel', style: 'cancel'},
                                    {text: 'OK', onPress: this.props.clearHistory},
                                ]
                            )
                        }}
                    />
                </View>
                <View>
                    <Subheader text={DIC.about} />
                    <Label
                        eiIcon="sc-github"
                        label={ `${DIC.githubRepository}: arthow4n/minimgur`}
                        onPress={() => {
                            Linking.openURL('https://github.com/arthow4n/minimgur').done();
                        }}
                    />
                </View>
            </ScrollView>
        )
    }
}

export default SettingsScene;
