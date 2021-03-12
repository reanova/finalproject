// pass 'props' as an argument to get access to the info being passed down from the parent (App)
// we can also use destructuring to pull up the properties inside props
export default function ProfilePic(props) {
    return (
        <div id="profilepic">
            <img
                className="profile-pic"
                src={props.imageUrl}
                onClick={props.toggleUploader}
            />
        </div>
    );
}
