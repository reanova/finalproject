import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Footer from "./footer";
import Video from "./bgvideo";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import OtherProfile from "./otherProfile";
import { FindPeople } from "./findpeople";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            uploaderIsVisible: false,
            bio: "",
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
                if (!userData.image_url) {
                    userData.image_url = "/randomuser.png";
                }
                this.setState({
                    first: userData.first,
                    last: userData.last,
                    imageUrl: userData.image_url,
                    bio: userData.bio,
                });
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

    setProfilePic(imageUrl) {
        console.log("Url from child: ", imageUrl);
        this.setState({
            imageUrl: imageUrl,
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    updateBioInApp(updateBio) {
        this.setState({
            bio: updateBio,
        });
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <header>
                        <div className="navbar">
                            <img className="logo1" src="/Pithagora.png" />
                            <Link to={"/findusers"} className="nav-link1">
                                Find Users
                            </Link>
                            <Link to="/" className="nav-link1">
                                {this.state.first} {this.state.last}
                            </Link>
                            <p
                                className="nav-link"
                                onClick={() => this.logout()}
                            >
                                Logout
                            </p>
                            <ProfilePic
                                imageUrl={this.state.imageUrl}
                                class1="profile-pic"
                                class2="image-pic"
                                toggleUploader={() => this.toggleUploader()}
                            />
                        </div>
                    </header>
                    <Video />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                bio={this.state.bio}
                                imageUrl={this.state.imageUrl}
                                toggleUploader={() => this.toggleUploader()}
                                updateBioInApp={this.updateBioInApp.bind(this)}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/findusers"
                        render={(props) => (
                            <FindPeople
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                </BrowserRouter>
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
