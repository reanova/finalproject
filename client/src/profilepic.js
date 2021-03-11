// pass 'props' as an argument to get access to the info being passed down from the parent (App)
// we can also use destructuring to pull up the properties inside props
export default function ProfilePic({ first, last, imageUrl }) {
    // console.log('props in Presentational: ', props);

    imageUrl = imageUrl || "randomuser.png";
    return (
        <div>
            <h2>
                This is a presentational component and my name is {first} and my
                last name is {last}.
            </h2>
            <img className="profile-pic" src={imageUrl} />
        </div>
    );
}
