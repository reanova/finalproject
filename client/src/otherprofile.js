import { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        console.log("id: ", id);
        axios.get(`/user/${id}.json`).then(({ data }) => {
            if (data.success) {
                console.log("Successfully fetched other user data: ", data);
                const { id, first, last, image_url, bio } = data;
                this.setState(
                    {
                        id: id,
                        first: first,
                        last: last,
                        imageUrl: image_url || "/randomuser.png",
                        bio: bio,
                    },
                    () => console.log("Other profile state: ", this.state)
                );
            } else {
                console.log("Error fetching user data");
            }
        });
    }

    handleChange() {}

    render() {
        return (
            <div>
                <p id="othername">
                    {this.state.first} {this.state.last}
                </p>
                <div className="profile">
                    <img className="bio-pic" src={this.state.imageUrl} />
                    <span>{this.state.bio}</span>
                </div>
            </div>
        );
    }
}
