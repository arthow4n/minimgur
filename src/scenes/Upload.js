import React, {
    Component,
    View,
    Text,
    ProgressBarAndroid as ProgressBar,
} from 'react-native';
import numeral from 'numeral';


import DIC from '../dictionary.config';
import {
    styles,
} from '../styles.js';

class UploadScene extends Component {

    static propTypes = {
        fileName: React.PropTypes.string,
        uploadProgress: React.PropTypes.number.isRequired,
        uploadProgressTotal: React.PropTypes.number.isRequired,
        uploadFilesCount: React.PropTypes.number.isRequired,
        uploadFilesTotal: React.PropTypes.number.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.scene}>
                <View style={styles.container}>
                    <Text style={{textAlign: 'center', margin: 16, fontSize: 18}}>
                        {(this.props.fileName ? this.props.fileName : DIC.uploadingMultipleImages)}
                    </Text>
                    <Text style={{textAlign: 'center', margin: 16}}>
                        {`${numeral(this.props.uploadProgress).format('0.00 b')} / ${numeral(this.props.uploadProgressTotal).format('0.00 b')}`}
                    </Text>
                    <ProgressBar
                        style={{margin: 24}}
                        styleAttr="Horizontal"
                        progress={this.props.uploadProgress / this.props.uploadProgressTotal}
                        indeterminate={false}
                    />
                    <Text style={{textAlign: 'center', margin: 16}}>
                        {`${DIC.uploadedImages} [${this.props.uploadFilesCount}/${this.props.uploadFilesTotal}]`}
                    </Text>
                </View>
            </View>
        );
    }
}

export default UploadScene;
