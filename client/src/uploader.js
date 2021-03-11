import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        console.log("props in Uploader: ", props);
    }

    componentDidMount() {
        console.log("uploader mounted!");
    }

    uploadImage(e) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        axios
            .post("/user/uploadimage", formData)
            .then(({ data }) => {
                console.log("Image upload response data: ", data);
                console.log("Image: ", data.imageUrl);
                if (data.success) {
                    this.props.setProfilePic(data.imageUrl);
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log("Error uploading image: ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div>
                <h2 className="uploader-text">
                    This is my uploader component!
                </h2>

                <h2 onClick={() => this.methodInUploader()}>
                    Click here to run method in uploader!
                </h2>
            </div>
        );
    }
}
