import React from 'react'
import { Text, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import * as firebase from 'firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

class MemberChapterHomeScreen extends React.Component {

    state = {
        location: {},
        uid: "",
        displayName: "",
        id: "",
        items: {},
        meetingId: "",
        errorMessage: null,
        successMessage: null
    }

    componentDidMount() {
        this._getLocationAsync();
        const { uid, displayName } = firebase.auth().currentUser;
        const { params } = this.props.navigation.state;
        const id = params ? params.id : null;
        this.setState({ id: id, uid: uid, displayName: displayName })
    }

    addAttendance = () => {
        let activeMeetingData = {}
        firebase.firestore().collection('chapters').doc(this.state.id).get()
            .then(doc => {
                activeMeetingData = doc.data().activeMeeting

                activeMeetingData.attendance.push(firebase.auth().currentUser.displayName)
                firebase.firestore().collection('chapters').doc(this.state.id).update({activeMeeting: activeMeetingData})
            })
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }
    
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };

    distance = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    attendMeeting = () => {
        firebase.firestore().collection('chapters').doc(this.state.id).get()
            .then(doc => {
                let activeData = doc.data().activeMeeting
                if(!(Object.entries(activeData).length === 0 && activeData.constructor === Object)) {
                    firebase.firestore().collection('chapters').doc(this.state.id).get()
                        .then(doc => {
                            let location = doc.data().activeMeeting.location
                            let distance = Math.abs(this.distance(location[1], location[0], this.state.location.coords.longitude, this.state.location.coords.latitude))
                            if(distance < 0.0001) {
                                this.addAttendance()
                                this.setState({ successMessage: 'Success: Attendance was marked'}, () => this.setState({ errorMessage: null }))
                            }
                            else {
                                this.setState({ errorMessage: 'Error: You are not in range of the meeting'}, () => this.setState({ successMessage: null }))
                            }
                        })
                }
                else {
                    this.setState({ errorMessage: 'Error: Meeting is not currently in session'}, () => this.setState({ successMessage: null }))
                }
            })
    }

    isEmptyObject = (obj) => {
        return !Object.keys(obj).length;
    }

    render() {
        return (
            <DismissKeyboard>
                <View>
                    <Text style={{fontSize: 40, fontWeight: "bold", textAlign: "center"}}>Member Home</Text>
                    <View style={styles.form} style={{margin: 50}}>
                        <View style={{marginTop: 32}}>
                                <TouchableOpacity style={styles.button} onPress={() => this.attendMeeting()}>
                                    <Text style={{color: "#FFF", fontWeight: "500", textAlign: "center"}}>Confirm Attendance</Text>
                                </TouchableOpacity>
                                <View style={styles.errorMessage}>
                                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                                </View>
                                <View style={styles.successMessage}>
                                    {this.state.successMessage && <Text style={styles.success}>{this.state.successMessage}</Text>}
                                </View>
                        </View>
                    </View>
                </View>
            </DismissKeyboard>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    successMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    success: {
        color: "#32CD32",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    typeInput: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D",
        marginBottom: 7
    },
    button: {
        marginTop: 50,
        marginHorizontal: 30,
        backgroundColor: "#000080",
        borderRadius: 4,
        height: 52,
        alignContent: "center",
        justifyContent: "center"
    },
    dateTimeText: {
        fontSize: 16,
        fontWeight: 'normal',
    },
});

export default MemberChapterHomeScreen