import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {fetchMapMarkers} from './Src/Redux/Slices/MapSlices';
import {useDispatch, useSelector} from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import {imagePaths} from './Src/assets/imagePath';

const {width, height} = Dimensions.get('window');

const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMapMarkers());
  }, []);
  const state = useSelector(state => state.mapReducer);
  const mapRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollY = useSharedValue(0);
  const mapAnimation = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler(event => {
    mapAnimation.value = event.contentOffset.x;
    scrollY.value = event.contentOffset.x;
  });

  const onMarkerPress = mapEventData => {
    const markerID = mapEventData._targetInst.return.key;
    let x = markerID * CARD_WIDTH + markerID * 20;
    scrollRef.current.scrollTo({x: x, y: 0, animated: true});
  };
  useAnimatedReaction(
    () => scrollY.value,
    value => {
      const index = Math.round(value / (CARD_WIDTH + 20));
      const targetCoordinate = state.mapMarker[index];

      if (targetCoordinate) {
        const targetRegion = {
          latitude: targetCoordinate.lat,
          longitude: targetCoordinate.lon,
          latitudeDelta: state.initailCordinates.latitudeDelta,
          longitudeDelta: state.initailCordinates.longitudeDelta,
        };
        runOnJS(mapRef?.current?.animateToRegion(targetRegion, 350));
      }
    },
    [state.mapMarker, state.region], // Dependencies that trigger the reaction
  );
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={state?.initailCordinates}>
        {state?.mapMarker?.map((marker, index) => (
          <Marker
            onPress={onMarkerPress}
            key={index}
            coordinate={{
              latitude: marker.lat,
              longitude: marker.lon,
            }}
            title={marker.name}
            description={marker.address}>
            <Animated.View style={[styles.markerWrap]}>
              <Animated.Image
                style={[styles.marker]}
                resizeMode="contain"
                source={imagePaths.customMarker}
              />
            </Animated.View>
          </Marker>
        ))}
      </MapView>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={handleScroll}>
        {state?.mapMarker?.map((marker, index) => {
          return (
            <View style={styles.card} key={index}>
              <Image
                source={{uri: marker?.thumbnail}}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>
                  {marker?.name}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker?.address}
                </Text>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    width: 30,
    height: 30,
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
});
