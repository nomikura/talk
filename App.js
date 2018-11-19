import React from 'react';
import { Alert, AsyncStorage, Platform, Button, StyleSheet, FlatList, TextInput, Text, View, PermissionsAndroid } from 'react-native';
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

    constructor(props) {
        super(props);
        this.state = {
            text: 'database access!',
            id: '',
            name: '',
            mail: '',
        };
    }

    static navigationOptions = {
        title: '設定',
        headerStyle: {backgroundColor:'#aa0000',},
        headerTintColor: 'white',
    };

    setData = async() => {
        try {
            let count = await AsyncStorage.getItem('MyData_count');
            if (count == null) { count = 1; }
            let data = {
                name: this.state.name,
                mail: this.state.mail
            };
            console.log(count);
            await AsyncStorage.setItem('MyData_'+count, JSON.stringify(data));
            let nextCount = parseInt(count, 10) + 1;
            console.log(nextCount);
            await AsyncStorage.setItem('MyData_count', nextCount.toString());
            this.setState({
                id: '',
                name: '',
                mail: '',
            });
            Alert.alert('set data!');
        } catch (error) {
            console.log(error);
            Alert.alert(error);
        }
    }

    getData = async () => {
        try {
            AsyncStorage.getItem('MyData_' + this.state.id)
                .then((data) => {
                    if (data != null) {
                        let obj = JSON.parse(data);
                        this.setState( { name: obj.name, mail: obj.mail } );
                    } else {
                        Alert.alert('no data!');
                    }
                });
        } catch (error) {
            console.log(error);
            Alert.alert(error);
        }
    }

    doName = (text) => this.setState({name: text});
    doMail = (text) => this.setState({mail: text});
    doID = (text) => this.setState({id: text});

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                    placeholder = 'ID: '
                    value={this.state.id}
                    onChangeText={this.doID}
                />
                <TextInput
                    placeholder = 'name: '
                    value={this.state.name}
                    onChangeText={this.doName}
                />
                <TextInput
                    placeholder = 'birthday: '
                    value={this.state.mail}
                    onChangeText={this.doMail}
                />
                <Button title="登録" onPress={this.setData}/>
                <Button title="見る" onPress={this.getData}/>
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
            say: '天気についての話をします',
        }
        this.index = 0;
        this.words = [
            '太陽',
            '寒くなってきましたね',
            '好きな季節はいつですか？',
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
            this.words[0] = '今日はなんともいえない天気ですね';
            if (weather == 'Clouds') {
                this.words[0] = '今日は曇ってますね';
            } else if (weather == 'Rain') {
                this.words[0] = '今日は雨が降ってますね';
            } else if (weather == 'Clear') {
                this.words[0] = '今日はいい天気ですね';
            }
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
    static navigationOptions = {
        title: '誕生日の話題',
        headerStyle: {backgroundColor:'#aa0000',},
        headerTintColor: 'white',
    };
    constructor(props) {
        super(props);
        this.words = [
            'aiueo',
            'kakikukeko',
            'sashisuseso',
        ];
        this.left = 0; // 閉区間
        this.right = 366; // 開区間
        this.mid = 0;
        this.count = 0;
        this.ok = 0; // 0: 探索中, 1: 正解: 2: 不正解
        this.state = {
            say: `誕生日当てゲームやります`,
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>セリフ: {this.state.say}</Text>
                <Button title="はい" onPress={this.pushYes} />
                <Button title="いいえ" onPress={this.pushNo} />
            </View>
        );
    }

    // はい、いいえをおしたときに値を渡す。もっといい方法あると思う
    pushYes = () => {
        // 「誕生日はnです」に対する処理.Yesが押されているので、登録画面に移動する
        if (this.ok === 1) {
            this.move()
        }
        this.search(true); }
    pushNo = () => { this.search(false); }

    numberToBirthday = (number) => {
        let months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30 ,31];
        let sum = 0, month = 0;
        for (let i = 0; i < months.length; i++) {
            if (sum + months[i] > number) {
                month = i;
                break;
            }
            sum += months[i];
        }
        let day = (sum == 0 ? number : number % sum);

        return `${month+1}月${day+1}日`;
    }

    search = (judge) => {
        this.count++;
        // 「ゲームを開始します」に対する処理(初回のみ)
        if (this.count === 1) {
            this.mid = Math.floor((this.left + this.right) / 2);
            this.setState({ say: `誕生日は${this.numberToBirthday(this.mid)}以降ですか？(この日付を含む)` });
            return;
        }

        // 「誕生日はnですか？」に対する処理(初回以降)
        this.mid = Math.floor((this.left + this.right) / 2);
        if (judge === true) {
            this.left = this.mid;
        } else {
            this.right = this.mid;
        }

        // 誕生日が確定する
        if (Math.abs(this.right - this.left) <= 1) {
            this.setState({ say: `誕生日は${this.numberToBirthday(this.left)}です` });
            this.ok = 1;
            return;
        }

        // 誕生日が確定していないとき、質問を続ける
        this.mid = Math.floor((this.left + this.right) / 2);
        this.setState({ say: `誕生日は${this.numberToBirthday(this.mid)}以降ですか？(この日付を含む)` });
    };

    move = () => {
        this.props.navigation.navigate('BirthdayRegistration')
    }

}

class BirthdayRegistrationScreen extends React.Component {
    static navigationOptions = {
        title: '誕生日を登録',
        headerStyle: {backgroundColor:'#aa0000',},
        headerTintColor: 'white',
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>登録!</Text>
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
    BirthdayRegistration: { screen: BirthdayRegistrationScreen },
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