import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Footer from "./footer";
import Video from "./bgvideo";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
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
                const userData = data.rows[0];
                if (!userData.imageUrl) {
                    userData.imageUrl = "/randomuser.png";
                }
                this.setState({
                    first: userData.first,
                    last: userData.last,
                    imageUrl: userData.imageUrl,
                });
                console.log(this.state.first);
            })
            .catch((error) => {
                console.log("Error fetching user data: ", error);
            });
    }

    logout() {
        axios.get("/logout").then(() => {
            window.location.reload();
            console.log("logged out");
        });
    }

    toggleUploader() {
        // console.log('toggleModal function is running!!!');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setProfilePic(image_url) {
        console.log("Url from child: ", image_url);
        this.setState({
            imageUrl: image_url,
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    render() {
        return (
            <>
                <header>
                    <img className="logo1" src="./Pithagora.png" />
                    <div className="navbar">
                        <p className="nav-link">
                            {this.state.first} {this.state.last}
                        </p>
                        <p className="nav-link" onClick={() => this.logout()}>
                            Logout
                        </p>
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            toggleUploader={() => this.toggleUploader()}
                        />
                    </div>
                </header>
                <Video />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setProfilePic={(imageUrl) =>
                            this.setProfilePic(imageUrl)
                        }
                        toggleUploader={() => this.toggleUploader()}
                    />
                )}
                <Footer />
            </>
        );
    }
}
