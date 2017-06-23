export function copyToClipboard(...arrStrings) {
    Clipboard.setString(arrStrings.join('\n'));
    Toast.show(DIC.copiedselectedUrlsToClipboard, Toast.SHORT);
}

export function shareText(...arrStrings) {
    Share.open({
        share_text: arrStrings.join('\n'),
    }, (e) => console.log(e));
}
