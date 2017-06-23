import {
    Dimensions,
    StyleSheet,
} from 'react-native';
import {
    MKColor,
} from 'react-native-material-kit';

export const styles = StyleSheet.create({
    scene: {
        flex: 1,
        marginTop: 56,
    },
    homeButtonContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 2,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8,
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    rowButton: {
        flex: 0,
        height: 56,
    },
    rowHistory: {
        flex: 0,
        height: 90,
    },
    mkButtonText: {
        color: MKColor.Teal,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mkButtonTextPrimary: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export const mkButtonCommonProps = {
    backgroundColor: MKColor.Silver,
    rippleColor: 'rgba(128,128,128,0.2)',
    maskColor: 'rgba(128,128,128,0.15)',
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

export const mkButtonCommonPropsPrimary = Object.assign({}, mkButtonCommonProps, {
    backgroundColor: MKColor.Indigo,
    rippleColor: 'rgba(255,255,255,0.2)',
    maskColor: 'rgba(255,255,255,0.15)',
});

export const CameraRollGalleryStyles =
    Object.assign(
        {},
        styles,
        {
            container: {
                flex: 1,
                backgroundColor: '#F5FCFF',
            },
            imageGrid: {
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
            },
        }
    );

export const CameraRollGalleryItemStyles =
Object.assign(
    {},
    CameraRollGalleryStyles,
    {
        imageBadge: {
            position: 'absolute',
            justifyContent: 'center',
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
    }
);

export default styles;
