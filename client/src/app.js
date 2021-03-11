import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "Layla",
            last: "Arias",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        // console.log('App mounted');
        // here is where we want to make an axios request to 'get' info about logged in user (first name, last name, and profilePicUrl / imageUrl)
        // an axios route '/user' is a good path for it
        // when we have the info from the server, add it to the state of the component (i.e. setState)
        axios
            .get("/user")
            .then(({ data }) => {
                if (!data.imageUrl) {
                    data.imageUrl = "/randomuser.png";
                }
                this.setState(data.userData);
            })
            .catch((error) => {
                console.log("Error fetching user data: ", error);
            });
    }

    toggleUploader() {
        // console.log('toggleModal function is running!!!');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setProfilePic(url) {
        console.log("Im running in App!!! and my argument is: ", url);
    }

    render() {
        return (
            <div>
                <h1>Hello from App</h1>

                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />

                <h2 onClick={() => this.toggleUploader()}>
                    Click here!! Changing uploaderIsVisible state with a
                    method!!
                </h2>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        // methodInApp={(arg) => this.methodInApp(arg)}
                        toggleModal={() => this.toggleModal()}
                    />
                )}
            </div>
        );
    }
}
