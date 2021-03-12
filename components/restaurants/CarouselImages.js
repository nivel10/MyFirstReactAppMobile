import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Image } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';


export default function CarouselImages({ images, height, width, }) {

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
        <Carousel
            data={images}
            layout={"default"}
            sliderWidth={width}
            itemWidth={width}
            itemHeight={height}
            renderItem={localRenderItem}
        />
    )
}

const styles = StyleSheet.create({
    
})