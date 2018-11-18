import React from 'react';
import { Button, StyleSheet, FlatList, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

// ホーム画面の処理
class HomeScreen extends React.Component {
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
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Weather!</Text>
            </View>
        );
    }
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