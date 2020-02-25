import React from 'react'
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Calendar, CalendarList, Agenda } from 'react-native-calendars';

class MemberChapterCalendarScreen extends React.Component {
    state = {
        items: {}
    }
   
    render() {
        return (
          <Agenda
            //items={this.state.items}
            items={{
              '2020-02-25': [{name: 'item 1 - any js object'}],
              '2020-02-26': [{name: 'item 2 - any js object', height: 80}],
              '2020-02-27': [],
              '2020-02-27': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
            }}
            loadItemsForMonth={this.loadItems.bind(this)}
            selected={Date.now()}
            renderItem={this.renderItem.bind(this)}
            renderEmptyDate={this.renderEmptyDate.bind(this)}
            rowHasChanged={this.rowHasChanged.bind(this)}
          />
        );
      }

      loadItems(day) {
        setTimeout(() => {
          for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            if (!this.state.items[strTime]) {
              this.state.items[strTime] = [];
              const numItems = Math.floor(Math.random() * 5);
              for (let j = 0; j < numItems; j++) {
                this.state.items[strTime].push({
                  name: 'Item for ' + strTime + ' #' + j,
                  height: Math.max(50, Math.floor(Math.random() * 150))
                });
              }
            }
          }
          const newItems = {};
          Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
          this.setState({
            items: newItems
          });
        }, 1000);
      }

      renderItem(item) {
        return (
          <TouchableOpacity 
            style={[styles.item, {height: item.height}]} 
            onPress={() => Alert.alert(item.name)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        );
      }

      renderEmptyDate() {
        return (
          <View style={styles.emptyDate}>
            <Text>This is empty date!</Text>
          </View>
        );
      }
    
      rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
      }
    
      timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
      }
    }


const styles = StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyDate: {
      height: 15,
      flex:1,
      paddingTop: 30
    }
  });

export default MemberChapterCalendarScreen