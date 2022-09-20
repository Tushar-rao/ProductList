import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';

const App = () => {
  const [data, setData] = useState([]);
  const [rawdata, setrawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allcategory, setallcategory] = useState([]);
  const [searchtext, setsearchtext] = useState('');

  //useEffect call for api
  useEffect(() => {
    fetchData();
  }, []);

  //funtion to fetch our api
  const fetchData = async () => {
    const resp = await fetch('https://dummyjson.com/products?limit=100');
    const data = await resp.json();
    setrawData(data.products);
    setData(data.products);
    setallcategory([...new Set(data.products.map(cat => cat.category))]);
    setLoading(false);
  };

  //filter funtion
  const filteritems = text => {
    let filteredName = rawdata.filter(item => {
      return item.brand.match(text) || item.category.match(text);
    });
    setData(filteredName);
  };

  //sorting functions
  const sortpriceItems = () => {
    setData(rawdata.sort((a, b) => a.price < b.price));
  };
  const sortratingItems = () => {
    setData(rawdata.sort((a, b) => a.rating < b.rating));
  };
  const sortdiscountItems = () => {
    setData(
      rawdata.sort((a, b) => a.discountPercentage < b.discountPercentage),
    );
  };

  //add to card function button
  const showToast = () => {
    ToastAndroid.show('Added to Cart !', ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView style={{backgroundColor: '#FF9899', flex: 1}}>
      <View style={styles.header}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
          PRODUCTS LIST
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          // flex: 1,
          paddingHorizontal: 10,
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        {allcategory.map(allproduct => {
          return data.filter(i => i.category == allproduct).length !== 0 ? (
            <View style={styles.categorycontainer}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'pink',
                  marginLeft: 20,
                  marginVertical: 20,
                  textDecorationLine: 'underline',
                  fontWeight: '700',
                }}>
                {allproduct.toUpperCase()}
              </Text>
              <FlatList
                numColumns={2}
                key={data.map(i => i.id)}
                data={data.filter(i => i.category == allproduct)}
                renderItem={item => (
                  <View style={styles.productcontainer}>
                    <Image
                      source={{uri: item.item.thumbnail}}
                      style={styles.productimage}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        width: '80%',
                        fontSize: 14,
                        color: 'black',
                        fontWeight: '500',
                      }}>
                      {item.item.title}
                    </Text>
                    {item.item.stock < 50 ? (
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 8,
                          color: 'red',
                          fontWeight: 'bold',
                        }}>
                        Hurry ! Only a few items left
                      </Text>
                    ) : null}
                    <TouchableOpacity
                      onPress={() => showToast()}
                      style={{
                        width: '80%',
                        height: 35,
                        backgroundColor: '#FFA7A6',
                        borderRadius: 15,
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'black',
                          fontWeight: 'bold',
                        }}>
                        BUY NOW
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ) : null;
        })}
      </ScrollView>
      <View style={styles.sortcontainer}>
        <TouchableOpacity
          style={styles.sortbtn}
          onPress={() => sortpriceItems()}>
          <Text style={styles.sortlabel}>Price</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortbtn}
          onPress={() => sortratingItems()}>
          <Text style={styles.sortlabel}>Rating</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortbtn}
          onPress={() => sortdiscountItems()}>
          <Text style={styles.sortlabel}>Discount</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        label="Email"
        style={styles.filterinputbox}
        onChangeText={text => filteritems(text)} //when inactive, set color to purple
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  categorycontainer: {
    height: 'auto',
    marginVertical: 10,
    width: '95%',
    borderRadius: 20,
    elevation: 2,
    backgroundColor: 'white',
  },
  productcontainer: {
    height: 185,
    marginVertical: 10,
    marginHorizontal: 10,
    width: '40%',
    borderRadius: 20,
    elevation: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFCBC4',
    width: '100%',
    height: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productimage: {
    width: '95%',
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 20,
  },
  sortlabel: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  sortbtn: {
    height: 30,
    width: 100,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterinputbox: {
    margin: 10,
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FF9899',
    borderRadius: 20,
    elevation: 5,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    padding: 10,
  },
  sortcontainer: {
    margin: 10,
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FF9899',
    borderRadius: 20,
    elevation: 5,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default App;
