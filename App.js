import React from 'react';
import { Platform, Button, StyleSheet, FlatList, Text, View, PermissionsAndroid } from 'react-native';
// import { Header, } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

// ホーム画面の処理
class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'トピック',
        headerStyle: {backgroundColor:'#aa0000',},
        headerTintColor: 'white',
    };

    topics = [
        { key: 'Weather' },
        { key: 'Birthday' },
        { key: 'Region' },
    ];
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <FlatList
                    data={this.topics}
                    renderItem={this.getItem}
                />
            </View>
        );
    }

    getItem = ({item}) => {
        return (
            <Text style={styles.item} onPress={() => this.doAction(item)} >{item.key}</Text>
        );
    }

    doAction = (item) => {
        this.props.navigation.navigate(item.key);
    }

}

// 設定画面の処理
class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: '設定',
        headerStyle: {backgroundColor:'#aa0000',},
        headerTintColor: 'white',
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings!</Text>
            </View>
        );
    }
}

// 詳細画面
class DetailsScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Details!</Text>
            </View>
        );
    }
}

// 天気の会話
class WeatherTopicScreen extends React.Component {
    static navigationOptions = {
        title: '天気の話題',
        headerStyle: {backgroundColor:'#aa0000',},
        headerTintColor: 'white',
    };

    constructor(props) {
        super(props);
        this.state = {
            coords: null,
            weather: null,
            say: 'ここにセリフが入ります',
        }
        this.index = 0;
        this.words = [
            'aiueo',
            'kakikukeko',
            'sashisuseso',
        ];
    }

    async componentDidMount() {
        try {
            // 現在地の座標を取得する
            const position = await getCurrentPosition(5000);
            const { latitude, longitude } = position.coords;
            this.setState({
                coords: {
                    latitude,
                    longitude
                }
            })

            const jsonData = await this.fetchJson(this.state.coords.latitude, this.state.coords.longitude, 'ab54639a165fd2c6ed3d4564ced1c152');
            const weather = jsonData.weather[0].main;
            this.setState({ weather: weather });
            console.log(this.state.weather, weather);

        } catch(e) {
            alert(e.message)
        }
    }

    async fetchJson(latitude, longitude, apiKey) {
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData;
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>セリフ: {this.state.say}</Text>
                <Button title="次へ" onPress={this.getWords}/>
            </View>
        );
    }

    getWords = () => {
        this.setState({ say: this.words[this.index] });
        this.index++;
    };

}


// 現在地を返す
async function getCurrentPosition(timeoutMillis = 10000) {
    if (Platform.OS === "android") {
        const ok = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (!ok) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                // TODO ユーザーにGPS使用許可がもらえなかった場合の処理
            }
        }
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: timeoutMillis });
    });
}


// 地域の会話
class RegionTopicScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Region!</Text>
            </View>
        );
    }
}

// 誕生日の会話
class BirthdayTopicScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Birthday!</Text>
            </View>
        );
    }
}

// ホーム画面のコンポーネント一覧
const HomeStack = createStackNavigator({
    Home: { screen: HomeScreen },
    Details: { screen: DetailsScreen },
    Weather: { screen: WeatherTopicScreen },
    Region: { screen: RegionTopicScreen },
    Birthday: { screen: BirthdayTopicScreen },
});

// 設定画面のコンポーネント一覧
const SettingsStack = createStackNavigator({
    Settings: { screen: SettingsScreen },
    Details: { screen: DetailsScreen },
});

// タブ一覧
const TabNavigator = createBottomTabNavigator({
    Home: { screen: HomeStack },
    Settings: { screen: SettingsStack },
});

// 何してんのかわからん
export default createAppContainer(TabNavigator);

// デザイン
const styles = StyleSheet.create({
    header: { color: '#ffff', fontSize: 26, },
    base: { padding: 0, flex: 1, },
    title : { padding: 5, fontSize: 35, },
    body: { padding: 10, flex: 1, },
    item: { padding: 3, margin: 5, fontSize: 24, borderWidth: 1, },
});