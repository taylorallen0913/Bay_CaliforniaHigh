import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import * as firebase from 'firebase';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

class JoinChapterScreen extends React.Component {

    state = {
        id: "",
        errorMessage: null
    }

    addUserToChapterCollection = (id, uid) => {
        var db = firebase.firestore()
        let chapterMemberList = []
        db.collection('chapters').doc(id).get()
            .then((document) => {
                console.log(document.data())
                chapterMemberList = document.data().members
                chapterMemberList.push(uid)
                db.collection('chapters').doc(id).set({ members: chapterMemberList }, { merge: true })
                console.log("DONE")
            })
    }

    joinChapter = () => {
        var db = firebase.firestore()
        const { uid } = firebase.auth().currentUser;    
        const id = this.state.id
        if(id != "") {
            db.collection('chapters').doc(id).get()
                .then(document => {
                    if(document.exists) {
                        this.addUserToChapterCollection(id, uid)
                        this.props.navigation.navigate("MemberHome")
                    }
                    else {
                        this.setState({ errorMessage: "Error: Chapter Does Not Exist" })
                    }
                })
        }
        else {
            this.setState({ errorMessage: "Error: Chapter ID Cannot Be Blank" })
        }
    }

    render() {
        return (
        <DismissKeyboard>
            <View style={styles.form}>
                <View style={{marginTop: 32}}>
                    <Text style={styles.inputText}>Enter Chapter ID</Text>
                    <TextInput 
                        style={styles.input}
                        autoCapitalize="none" 
                        onChangeText={id => this.setState({ id })}
                        value={this.state.id}
                        ></TextInput>
                </View>
                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>
                <TouchableOpacity style={styles.button} onPress={this.joinChapter}>
                    <Text style={{color: "#FFF", fontWeight: "500", textAlign: "center"}}>Join Chapter</Text>
                </TouchableOpacity>
                
                <Text style={{ textAlign: "center", fontSize: 30 }}>{this.showErrorMessage}</Text>
                
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
    button: {
        marginTop: 200,
        marginHorizontal: 30,
        backgroundColor: "#E9446A",
        borderRadius: 4,
        height: 52,
        alignContent: "center",
        justifyContent: "center"
    }
});

export default JoinChapterScreen