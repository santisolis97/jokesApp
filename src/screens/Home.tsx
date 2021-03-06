import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC, useContext, useLayoutEffect, useState} from 'react';
import Title from '../components/Title';
import Card from '../components/Card';
import Button from '../components/Button';
import Carousel from '../components/Carousel';
import useJokes, {Joke} from '../hooks/useJokes';
import {FavJokesContext} from '../store/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {JOKE_CARD_COLORS} from '../utils/Colors';
import {RootStackParamList} from '../navigator/AppNavigator';

const {width} = Dimensions.get('window');

type HomeProps = Partial<NativeStackScreenProps<RootStackParamList>>;

const Home: FC<HomeProps> = ({navigation}) => {
  const {favJokes, addFavJoke} = useContext(FavJokesContext);
  const {jokes, fourJokes, fetchMoreJokes, isLoading} = useJokes();
  const [cardIndex, setCardIndex] = useState(0);
  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    navigation?.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation?.navigate('Saved')}>
          <Text testID={'header-right'} style={styles.saved}>
            Saved: {favJokes.length}{' '}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, favJokes]);

  const cardIndexChange = (index: number) => {
    setCardIndex(index % 4);
    setIndex(index);
  };

  const handleSaveJoke = () => {
    if (!!addFavJoke) {
      addFavJoke(jokes[index]);
    }
  };
  return (
    <View style={styles.root}>
      <Title text={'Things you can say to annoy designers.'} />
      <View style={styles.carouselContainer}>
        {jokes.length > 0 ? (
          <Carousel
            indexChange={cardIndexChange}
            items={jokes}
            display={isLoading && {opacity: 0.2}}
            cardIndex={cardIndex}
            renderItem={(
              scrollX: any,
              {item, index}: {item: Joke; index: number},
            ) => {
              return (
                <Card
                  isLoading={isLoading}
                  text={item.joke}
                  backgroundColor={JOKE_CARD_COLORS[index % 4]}
                />
              );
            }}
            fetchNextJokes={() => {
              fetchMoreJokes();
            }}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={'black'} />
          </View>
        )}
      </View>
      <Button title={'Save'} onPress={handleSaveJoke} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    flex: 5,
  },
  carousel: {
    flex: 1,
    backgroundColor: 'pink',
    width: '100%',
  },
  saved: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
