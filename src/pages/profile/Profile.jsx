import React from "react";
import { useState, useRef } from "react";
import { useAuthContext } from "../../providers/AuthProvider";
import { useOrderContext } from "../../providers/OrderProvider";
import { MdVerified, MdPendingActions, MdOutlineAddTask } from "react-icons/md";
import { MdAccessTime, MdTaskAlt } from "react-icons/md";
import { MdModeEdit, MdAdd } from "react-icons/md";
import { timeAgo } from "../../../utils/helpers/TimeAgo";
import Transaction from "../../components/transactions/Transaction";
import "./profile.css";

const Profile = () => {
  const {
    loadingUserProfile,
    loadedUserProfile,
    submitNewBio,
    uploadProfilePhoto,
    userToken,
  } = useAuthContext();

  const [userProfile, setUserProfile] = useState(loadedUserProfile);

  const { ordersCompleted, ordersInProgress } = useOrderContext();

  const [editBio, setEditBio] = useState(false);
  const [editedBio, setEditedBio] = useState(userProfile?.bio);

  const fileInputRef = useRef(null);

  const toggleEditBio = () => {
    setEditBio(userProfile?.bio);
    setEditBio(!editBio);
  };

  const openFileDialog = () => {
    console.log("Open");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateProfilePhoto = (e) => {
    const profilePhoto = e.target.files[0];
    console.log("Submitted");

    if (profilePhoto) {
      if (profilePhoto.size <= 5 * 1024 * 1024) {
        uploadProfilePhoto(profilePhoto, userProfile?.id).then((json) => {
          const updateProfile = {
            ...userProfile,
            profile_photo: json.profile_photo,
          };

          userProfile.profile_photo = json.profile_photo;
          setUserProfile(updateProfile);
        });
      } else {
        console.log("Select lower resolution image");
      }
    } else {
      console.log("Select correct img format");
    }
  };
  const submitEditedProfile = () => {
    if (userProfile.bio != editedBio) {
      submitNewBio(editedBio, userProfile?.id).then((response) => {
        const updatedProfile = {
          ...userProfile,
          bio: response.bio,
        };
        userProfile.bio = response.bio;
        setUserProfile(updatedProfile);
      });
    }
    setEditBio(false);
  };

  const iconSize = 25;

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <div className="p-4 my-4">
          <div className="flex gap-3 items-center">
            {userProfile?.profile_photo ? (
              <img
                style={{
                  animation: loadingUserProfile
                    ? `skeleton-loading 1s linear infinite alternate`
                    : "",
                }}
                onClick={openFileDialog}
                className=""
                src={userProfile?.profile_photo}
                alt="profile cover"
              />
            ) : (
              <label
                style={{
                  animation: loadingUserProfile
                    ? `skeleton-loading 1s linear infinite alternate`
                    : "",
                }}
                htmlFor="upload-profile"
                className="bg-sky-300 rounded-full w-16 p-4 text-center text-white text-2xl"
              >
                {userProfile &&
                  `${
                    userProfile?.username?.charAt(0)?.toUpperCase() +
                    userProfile?.username.slice(1).slice(0, 1)
                  }`}
              </label>
            )}
            <input
              id="upload-profile"
              onChange={updateProfilePhoto}
              ref={fileInputRef}
              style={{ display: "none" }}
              size={5 * 1024 * 1024}
              accept="image/*"
              type="file"
            />
            <div className="space-y-1 text-gray-600">
              <article
                className={loadingUserProfile ? "username-skeleton" : ""}
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  color: "#f7fafc",
                }}
              >
                {userProfile?.username}
                {userProfile?.is_verified === "True" && (
                  <MdVerified className="" size={iconSize} />
                )}
              </article>
              <article
                className="text-white"
                style={{
                  animation: loadingUserProfile
                    ? `skeleton-loading 1s linear infinite alternate`
                    : "",
                }}
              >
                {userProfile?.email}
              </article>
            </div>
          </div>
          <div className="prof-summary flex flex-wrap gap-4 w-full items-center mt-4">
            <div className="prof-element justify-between p-4 border border-sky-300 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdTaskAlt className="text-white" size={iconSize} />
                <article className="text-white">Total Orders</article>
              </div>
              <span className="">{userProfile?.orders_count}</span>
            </div>
            <div className="prof-element justify-between p-4 border border-sky-300 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdPendingActions className="text-white" size={iconSize} />
                <article className="text-white">Orders in Progress</article>
              </div>
              <span className="">{ordersInProgress.count}</span>
            </div>
            <div className="prof-element justify-between p-4 border border-sky-300 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdOutlineAddTask className="text-white" size={iconSize} />
                <article className="text-white">Orders completed</article>
              </div>
              <span className="">{ordersCompleted?.count}</span>
            </div>
            <div className="prof-element justify-between p-4 border border-sky-300 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-white" size={iconSize} />
                <article className="text-white">Last Login</article>
              </div>
              <article className="text-white">
                {userProfile ? timeAgo(userProfile?.last_login) : "---"}
              </article>
            </div>
          </div>
          <div className="mt-5 flex flex-col space-y-2 mb-4">
            <div className="bio">
              <strong style={{ display: "flex", gap: "1rem" }}>
                Bio
                {userProfile?.bio && (
                  <MdModeEdit
                    onClick={toggleEditBio}
                    style={{ cursor: "pointer" }}
                    size={20}
                  />
                )}
              </strong>
              {editBio ? (
                <textarea
                  name=""
                  id=""
                  rows="4"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  style={{
                    resize: "none",
                    border: "none",
                    width: "100%",
                    padding: "4px",
                    outline: "none",
                    color: "#535354",
                    backgroundColor: "#f7fafc",
                  }}
                />
              ) : userProfile?.bio ? (
                <article>{userProfile?.bio}</article>
              ) : (
                <article
                  style={{ color: "orange", display: "flex", gap: "1rem" }}
                >
                  Set your bio
                  {
                    <MdAdd
                      onClick={toggleEditBio}
                      style={{ cursor: "pointer" }}
                      size={iconSize}
                    />
                  }
                </article>
              )}
            </div>
            <button className="save" onClick={submitEditedProfile} style={{}}>
              Save
            </button>
            <Transaction user={userProfile?.username} userToken={userToken} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
