import React, {
    Component,
    Dimensions,
    ListView,
    View,
} from 'react-native';

import HistoryConrolls from '../components/HistoryControlls';
import HistoryRow from '../components/HistoryRow';

import {
    styles,
} from '../styles.js';

const RENDER_RANGE = Dimensions.get('window').height * 6;

export default class HistoryScene extends Component {
    static propTypes = {
        asResultsScene: React.PropTypes.bool,
        deleteImage: React.PropTypes.func,
        history: React.PropTypes.array.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedUrls: [],
        };
    }

    componentDidMount() {
        this.initializeState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.initializeState(nextProps);
    }

    initializeState(props) {
        this.setState({
            selectedUrls:
                this.props.asResultsScene ?
                this.props.history.map((image) => image.link) :
                [],
        });
    }

    render() {
        const history = this.props.history;
        const ds =
            new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 })
                .cloneWithRows(history);
        return (
            <View style={styles.scene}>
                <View style={styles.row}>
                    <ListView
                        dataSource={ds}
                        initialListSize={12}
                        pageSize={24}
                        scrollRenderAheadDistance={RENDER_RANGE}
                        renderSeparator={(sectionId, rowId) => (
                            <View
                                style={{ height: 1, backgroundColor: '#EAEAEA' }}
                                key={`${sectionId}-${rowId}`}
                            />
                        )}
                        renderRow={(image) => (
                            this.props.asResultsScene ?
                            (
                                <HistoryRow
                                    checkedByDefault={true}
                                    image={image}
                                    setSelected={this.setSelected.bind(this, image.link)}
                                />
                            )
                            :
                            (
                                <HistoryRow
                                    deleteImage={this.props.deleteImage.bind(this, image)}
                                    image={image}
                                    setSelected={this.setSelected.bind(this, image.link)}
                                />
                            )
                        )}
                    />
                </View>
                <HistoryConrolls
                    selectedUrls={this.state.selectedUrls}
                />
            </View>
        );
    }

    setSelected(targetUrl, selected) {
        this.setState({
            selectedUrls:
                selected ?
                this.state.selectedUrls.concat(targetUrl) :
                this.state.selectedUrls.filter((url) => url !== targetUrl),
        });
    }
}
