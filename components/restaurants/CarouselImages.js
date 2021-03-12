import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Image } from 'react-native-elements';
import Carousel, { Pagination, } from 'react-native-snap-carousel';
import { size } from 'lodash';

export default function CarouselImages({ images, height, width, activeSlide, setActiveSlide }) {

    const localRenderItem = ({ item }) =>{
        return (
            <Image
                PlaceholderContent={<ActivityIndicator  size="large" color="#fff"/>}
                style={{height: height, width: width, }}
                source={{uri: item, }}
                
            />
        )
    }

    return (
        <View>
            <Carousel
                data={images}
                layout={"default"}
                sliderWidth={width}
                itemWidth={width}
                itemHeight={height}
                renderItem={localRenderItem}
                onSnapToItem={(index) => setActiveSlide(index)}
            />
            <CarouselPagination
                data={images}
                activeSlide={activeSlide}
            />
        </View>
    )
}

function CarouselPagination({data, activeSlide}){
    return (
        <Pagination
            activeDotIndex={activeSlide}
            containerStyle={styles.containerPagination}
            dotsLength={size(data)}
            dotStyle={styles.docActive}
            inactiveDotStyle={styles.docInactive}
            inactiveDotOpacity={0.6}
            inactiveDotScale={0.6}
        />
    );
}

const styles = StyleSheet.create({
    containerPagination: {
        backgroundColor: "transparent",
        zIndex: 1,
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
    },

    docActive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 2,
        backgroundColor: "#f2936c"
    },

    docInactive: {
        width: 12,
        height: 12,
        borderRadius: 7,
        marginHorizontal: 2,
        backgroundColor: "#ffff"  
    },
})