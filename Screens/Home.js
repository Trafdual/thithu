import React, { useEffect, useState } from 'react';
import { Button, View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet,Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
const Home = () => {
    const [device, setDevice] = useState([]);
    const [name, setname] = useState('');
    const [number, setNumber] = useState('');
    const [price, setPrice] = useState('');
    const [id, setid] = useState('');
    const [date, setDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }


    const getDevice = async () => {
        try {
            const API_URL = 'http://192.168.1.168:3000/device';
            const response = await fetch(API_URL);
            const data = await response.json();
            setDevice(data);
        } catch (error) {
            log.error('Fetch data failed ' + error);
        }
    };

    const addDevice = () => {
        if (name == '') {
            alert('ten khong duoc de trong')
        }
        else if (number == '') {
            alert('so luong khong duoc de trong')
        } else if (price == '') {
            alert('gia khong duoc de trong')
        } else if (date == '') {
            alert('ngay khong duoc de trong')
        }
        else {
            fetch("http://192.168.1.168:3000/device", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    number: number,
                    date: date,
                    price: price
                })
            }
            ).then((res) => res.json()).then(resJson => {

                setDevice(resJson);
                setname('');
                setNumber('');
                setPrice('');
                setDate('');
                setModalVisible(!modalVisible);
                getDevice();
            }).catch(err => { console.log(err) })
        }

    }

    const deleteDevice = async (id) => {
        try {
            const API_URL = 'http://192.168.1.168:3000/device/' + id;
            const response = await fetch(API_URL, { method: 'DELETE' });
            if (response && response.status === 200) {
                getDevice();
            }
        } catch (error) {
            log.error('Delete data failed ' + error);
        }
    };

    const updateDevice = async (id) => {
        if (name == '') {
            alert('ten khong duoc de trong')
        }
        else if (number == '') {
            alert('so luong khong duoc de trong')
        } else if (price == '') {
            alert('gia khong duoc de trong')
        } else if (date == '') {
            alert('ngay khong duoc de trong')
        }
        else {
            try {
                const API_URL = 'http://192.168.1.168:3000/device/' + id;
                const response = await fetch(API_URL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            name: name,
                            number: number,
                            date: date,
                            price: price
                        }
                    )
                });
                if (!response.ok) {
                    console.log('Lỗi cập nhật thông tin');
                    return;
                }
                setid('');
                setname('');
                setNumber('');
                setPrice('');
                setDate('');
                setModalVisible(!modalVisible);
                getDevice();
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        getDevice();
    }, []);

    const edit = (id, name, number, price, date) => {
        setModalVisible(!modalVisible);
        setid(id);
        setname(name);
        setNumber(number);
        setPrice(price);
        setDate(date);
    }

    const renderDevice = () => {
        return (
            <View>
                <Button title='Thêm Thiết Bị' onPress={toggleModal} />
                <FlatList
                    data={device}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.item1}>
                                <View style={styles.itemImageContainer1}>
                                    <Image style={styles.itemImage1} source={require('../assets/favicon.png')} resizeMode='contain' />
                                </View>
                                <View>
                                    <Text>ID: {item.id}</Text>
                                    <Text>Name: {item.name}</Text>
                                    <Text>Number: {item.number}</Text>
                                    <Text>date: {item.date}</Text>
                                    <Text>price: {item.price}</Text>
                                </View>
                                <View style={{ marginLeft: 20 }}>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDevice(item.id)}>
                                        <FontAwesome5 name='trash-alt' size={25} color='red' />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => edit(item.id, item.name, item.number, item.price, item.date)}>
                                        <MaterialIcons name='edit' size={25} color='red' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }} />
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.root}>
                        <TextInput value={name} onChangeText={(text) => setname(text)} placeholder='Name' />
                        <TextInput value={number} onChangeText={(text) => setNumber(text)} placeholder='Number' />
                        <TextInput value={date} onChangeText={(text) => setDate(text)} placeholder='Date' />
                        <TextInput value={price} onChangeText={(text) => setPrice(text)} placeholder='Price' />
                        <Button title='save' onPress={() => {
                            if (id) {
                                updateDevice(id);
                            }
                            else {
                                addDevice();
                            }
                        }} />
                    </View>
                </Modal>
            </View>
        );
    };
    return renderDevice();
};
const styles = StyleSheet.create({
   root: {
        alignItems: 'center',
        padding: 20,
    }, item1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 0.5
    },
    itemImageContainer1: {
        width: 100,
        height: 100,
        borderRadius: 100
    },
    itemImage1: {
        flex: 1,
        width: 70,
        height: 70
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    }
});
export default Home;