import {
    Clipboard,
    ToastAndroid as Toast,
} from 'react-native';
import Share from 'react-native-share';

import DIC from '../dictionary.config';

export function copyToClipboard(arrStrings) {
    Clipboard.setString(arrStrings.join('\n'));
    Toast.show(DIC.copiedSelectedURLsToClipboard, Toast.SHORT);
}

export function shareText(arrStrings) {
    Share.open({
        message: arrStrings.join('\n'),
    }, (e) => console.log(e));
}
