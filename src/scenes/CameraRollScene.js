/**
 * Derived from https://github.com/bamlab/rn-camera-roll/blob/master/example/CameraRollGallery.js
 */

import React, {
  CameraRoll,
  Component,
  Dimensions,
  Image,
  Platform,
  PropTypes,
  ListView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
    MKButton,
    MKColor,
} from 'react-native-material-kit';

import CameraRollGalleryItem from '../components/CameraRollGalleryItem';

import DIC from '../dictionary.config.js';
import {
    CameraRollGalleryStyles as styles,
    mkButtonCommonPropsPrimary,
} from '../styles';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const RENDER_RANGE = Dimensions.get('window').height * 6;
const PHOTOS_COUNT_BY_FETCH = 64;

export default class CameraRollScene extends Component {
    static propTypes = {
        onUpload: React.PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.lastPhotoFetched = undefined; // Using `null` would crash ReactNative CameraRoll on iOS.
        this.state = {
            dataSource: this.ds.cloneWithRows([]),
            images: [],
            selected: [],
        };
    }

    componentDidMount() {
        this.fetchPhotos();
    }

    getDataSourceState() {
        return {
            dataSource: this.ds.cloneWithRows(this.state.images),
        };
    }

    getPhotosFromCameraRollData(data) {
        return data.edges.map((asset) => asset.node.image);
    }

    onPhotosFetchedSuccess = (data) => {
        const newPhotos = this.getPhotosFromCameraRollData(data);
        this.setState({
            dataSource: this.getDataSourceState().dataSource,
            images: this.state.images.concat(newPhotos),
        });
        if (data.page_info.has_next_page) {
            this.lastPhotoFetched = data.page_info.end_cursor;
        };
    }

    onPhotosFetchError(err) {
        console.error(err);
    }

    fetchPhotos(count = PHOTOS_COUNT_BY_FETCH, after) {
        CameraRoll
            .getPhotos({
                first: count,
                after,
            })
            .then((data) => this.onPhotosFetchedSuccess(data))
            .catch((data) => this.onPhotosFetchError(data));
    }

    onEndReached = () => {
        this.fetchPhotos(PHOTOS_COUNT_BY_FETCH, this.lastPhotoFetched);
    }

    render() {
        return (
            <View style={styles.scene}>
                <View style={styles.container}>
                    <ListView
                        initialListSize={PHOTOS_COUNT_BY_FETCH / 2}
                        pageSize={PHOTOS_COUNT_BY_FETCH / 2}
                        contentContainerStyle={styles.imageGrid}
                        dataSource={this.state.dataSource}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={WINDOW_HEIGHT / 2}
                        showsVerticalScrollIndicator={false}
                        renderRow={(image) => (
                            <CameraRollGalleryItem
                                imageSrc={image.uri}
                                selectedIndex={this.state.selected.indexOf(image.uri)}
                                onPress={this.selectImage.bind(this, image)}
                            />
                        )}
                    />
                    <View style={[styles.row, styles.rowButton]}>
                        <MKButton
                            {...mkButtonCommonPropsPrimary}
                            onPress={() => this.props.onUpload(this.state.selected)}
                        >
                            <Text
                                pointerEvents="none"
                                style={[styles.mkButtonTextPrimary, { fontSize: 16 }]}
                            >
                                {DIC.uploadSelectedImages}
                            </Text>
                        </MKButton>
                    </View>
                </View>
            </View>
        );
    }

    selectImage(image) {
        const newImages = this.state.images.slice();
        this.setState({
            dataSource: this.ds.cloneWithRows(newImages),
            images: newImages,
            selected:
                this.state.selected.indexOf(image.uri) !== -1 ?
                this.state.selected.filter((uri) => uri !== image.uri) :
                [...this.state.selected, image.uri],
        });
    }
}
