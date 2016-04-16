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

const mkButtonCommonPropsPrimary = {
    backgroundColor: MKColor.Silver,
    rippleColor: 'rgba(255,255,255,0.2)',
    maskColor: 'rgba(255,255,255,0.15)',
    flex: 1,
    borderColor: 'rgba(0,0,0,.1)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'stretch',
    shadowRadius: 2,
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.7,
    shadowColor: 'black',
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  row: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
  },
  rowButton: {
      flex: 0,
      height: 56,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 32,
      height: 32,
      backgroundColor: MKColor.Teal,
      borderBottomLeftRadius: 16,
  },
  image: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },
  imageBorder: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
    position: 'absolute',
    top: 0,
    left: 0,
    borderColor: MKColor.Teal,
    borderWidth: 4,
  },
  mkButtonTextPrimary: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center'
  },
  mkButtonTextPrimary: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center'
  },
};

const WINDOW_HEIGHT = Dimensions.get('window').height;

const RENDER_RANGE = Dimensions.get('window').height * 6;

let PHOTOS_COUNT_BY_FETCH = 128;

export default class CameraRollGallery extends Component {

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.lastPhotoFetched = undefined; // Using `null` would crash ReactNative CameraRoll on iOS.
    this.state = {
        dataSource: this.ds.cloneWithRows([]),
        images: [],
        selected: [],
    };
    this.fetchPhotos();
  }

  getDataSourceState() {
    return {
      dataSource: this.ds.cloneWithRows(this.state.images),
    };
  }

  getPhotosFromCameraRollData(data) {
    return data.edges.map((asset) => {
        const image = asset.node.image;
        image.selected = undefined;
        return image;
    });
  }

  onPhotosFetchedSuccess(data) {
      console.log(data);
    const newPhotos = this.getPhotosFromCameraRollData(data);
    this.setState(Object.assign({}, this.state, {
        images: this.state.images.concat(newPhotos),
    }));
    this.setState(Object.assign({}, this.state, {
        dataSource: this.getDataSourceState().dataSource,
    }));
    if (data.page_info.has_next_page) this.lastPhotoFetched = data.page_info.end_cursor;
  }

  onPhotosFetchError(err) {
    console.error(err);
  }

  fetchPhotos(count = PHOTOS_COUNT_BY_FETCH, after) {
    const onSuccess = this.onPhotosFetchedSuccess.bind(this);
    const onError = this.onPhotosFetchError.bind(this)
    CameraRoll.getPhotos({
      first: count,
      after,
    })
    .then((data) => onSuccess(data))
    .catch((data) => onError(data));
  }

  onEndReached() {
    this.fetchPhotos(PHOTOS_COUNT_BY_FETCH, this.lastPhotoFetched);
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          initialListSize={PHOTOS_COUNT_BY_FETCH / 4}
          pageSize={PHOTOS_COUNT_BY_FETCH / 4}
          contentContainerStyle={styles.imageGrid}
          dataSource={this.state.dataSource}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={360}
          showsVerticalScrollIndicator={false}
          renderRow={(image) => {return (
            <TouchableOpacity onPress={() => {
                const newArray = this.state.images.slice();
                if (this.state.selected.indexOf(image.uri) !== -1) {
                    this.setState(Object.assign({}, this.state, {
                        dataSource: this.ds.cloneWithRows(newArray),
                        images: newArray,
                        selected: this.state.selected.filter((uri) => uri !== image.uri),
                    }));
                } else {
                    this.setState(Object.assign({}, this.state, {
                        dataSource: this.ds.cloneWithRows(newArray),
                        images: newArray,
                        selected: [...this.state.selected, image.uri],
                    }));
                }
                console.log(this.state.selected);
            }}>
                <View>
                    <Image
                        style={styles.image}
                        source={{ uri: image.uri }}
                    />
                </View>
                {(() => {
                    const selectedIndex = this.state.selected.indexOf(image.uri);
                    if (selectedIndex !== -1) {
                        return (
                            <View style={[styles.imageGrid ,styles.imageBadge]}>
                                <Text style={styles.mkButtonTextPrimary}>{selectedIndex + 1}</Text>
                            </View>
                        )
                    }
                })()}
                {(() => {
                    const selectedIndex = this.state.selected.indexOf(image.uri);
                    if (selectedIndex !== -1) {
                        return (
                            <View style={[styles.imageBorder]}></View>
                        )
                    }
                })()}
            </TouchableOpacity>
          )}}
        />
        <View style={[styles.row, styles.rowButton]}>
            <MKButton {...mkButtonCommonPropsPrimary} backgroundColor={MKColor.Indigo} onPress={() => {
                    this.props.onUpload(this.state.selected);
                }}>
                <Text pointerEvents="none"
                    style={[styles.mkButtonTextPrimary, { fontSize: 16 }]}>
                    Upload select images
                </Text>
            </MKButton>
        </View>
      </View>
    );
  }
}
