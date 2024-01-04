import React from 'react';
import { useState, useRef } from 'react';
import { useAuthContext } from '../../providers/AuthProvider';
import { useOrderContext } from '../../providers/OrderProvider';
import { MdVerified, MdPendingActions, MdOutlineAddTask } from "react-icons/md";
import { MdAccessTime, MdTaskAlt } from "react-icons/md";
import { MdModeEdit, MdAdd  } from "react-icons/md";
import { timeAgo } from '../../../utils/helpers/TimeAgo';
import './profile.css';

const Profile = () => {
    const { loadingUserProfile, loadedUserProfile, submitNewBio, uploadProfilePhoto } = useAuthContext();

    const [userProfile, setUserProfile] = useState(loadedUserProfile);

    const { ordersCompleted, ordersInProgress, } = useOrderContext();

    const [editBio, setEditBio] = useState(false);
    const [editedBio, setEditedBio] = useState(userProfile?.bio);

    const fileInputRef = useRef(null);

    const { orders } = useOrderContext();
    console.log("orders",orders);

    const toggleEditBio = () => {
        setEditBio(userProfile?.bio);
        setEditBio(!editBio);
    }

    const openFileDialog = () => {
        console.log("Open")
        if(fileInputRef.current){
            fileInputRef.current.click();
        }
    }

    const updateProfilePhoto = (e) => {
        const profilePhoto = e.target.files[0];
        console.log("Submitted");
        
        if (profilePhoto) {
            if (profilePhoto.size <= 5 *1024 *1024){
                uploadProfilePhoto(profilePhoto, userProfile?.id)
                .then((json)=>{
                    const updateProfile = {
                        ...userProfile,
                        profile_photo: json.profile_photo
                    }

                    userProfile.profile_photo = json.profile_photo;
                    setUserProfile(updateProfile)
                })
            }
            else {
                console.log("Select lower resolution image")
            }
        } else {
            console.log("Select correct img format")
        }
    }
    const submitEditedProfile = () => {
        if(userProfile.bio != editedBio){
            submitNewBio(editedBio, (userProfile?.id))
            .then((response)=>{
                const updatedProfile = {
                    ...userProfile,
                    bio: response.bio
                }
                userProfile.bio = response.bio;
                setUserProfile(updatedProfile);
            })
        }
        setEditBio(false);
    }

    const iconSize = 25;

    return (
    <div className='h-screen flex mt-14'>
        <div className='w-64 bg-sky-300'>
            {/* the sidebar */}
        </div>
        <div className='flex-1 flex flex-col'>
            <div className='p-4 my-10'>
                <div className='flex gap-3 items-center'>
                    {                    
                        userProfile?.profile_photo?
                        <img style={{
                            animation: loadingUserProfile?`skeleton-loading 1s linear infinite alternate`:''
                        }} onClick={openFileDialog} className='' src={userProfile?.profile_photo} alt="profile cover" />:
                        <label style={{
                            animation: loadingUserProfile?`skeleton-loading 1s linear infinite alternate`:''
                        }} htmlFor='upload-profile' className='bg-sky-300 rounded-full w-16 p-4 text-center text-white text-2xl'>{ userProfile &&`${(userProfile?.username?.charAt(0)?.toUpperCase() + userProfile?.username.slice(1).slice(0,1))}`}</label>
                    }
                    <input id='upload-profile' onChange={updateProfilePhoto} ref={fileInputRef} style={{ display: 'none' }} size={5 * 1024 * 1024} accept='image/*' type="file" /> 
                    <div className='space-y-1 text-gray-600'>
                        <article className={loadingUserProfile?'username-skeleton':''} style={{fontWeight:'bold', display:'flex', gap:'1rem', alignItems:'center'}}>
                            {userProfile?.username} 
                            {
                                (userProfile?.is_verified === 'True') && <MdVerified className='' size={iconSize}/>
                            }
                        </article>
                        <article style={{
                            animation: loadingUserProfile?`skeleton-loading 1s linear infinite alternate`:''
                        }}>{userProfile?.email}</article>
                    </div>
                </div>
                <div className='flex flex-wrap gap-4 w-full items-center mt-4'>
                    <div className='justify-between p-4 border border-sky-300 flex items-center flex-1 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <MdTaskAlt className='text-sky-300' size={iconSize}/>
                            <article>Total Orders</article>
                        </div>
                        <article className=''>{userProfile?.orders_count}</article>
                    </div>
                    <div className='justify-between p-4 border border-sky-300 flex items-center flex-1 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <MdPendingActions className='text-sky-300' size={iconSize}/>
                            <article>Orders in Progress</article>
                        </div>
                        <article className=''>{ordersInProgress.length}</article>
                    </div>
                    <div className='justify-between p-4 border border-sky-300 flex items-center flex-1 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <MdOutlineAddTask className='text-sky-300' size={iconSize}/>
                            <article>Orders completed</article>
                        </div>
                        <article className=''>{ordersCompleted?.length}</article>
                    </div>
                    <div className='justify-between p-4 border border-sky-300 flex items-center flex-1 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <MdAccessTime className='text-sky-300' size={iconSize}/>
                            <article>Last Login</article>
                        </div>
                        <article className=''>{userProfile ? timeAgo(userProfile?.last_login):'---'}</article>
                    </div>
                </div>
                <div className='mt-5 flex flex-col space-y-2'>
                    <div className='bio'>
                        <strong style={{display:'flex', gap:'1rem'}}>Bio
                            {
                                userProfile?.bio &&
                                (                                
                                    <MdModeEdit onClick={toggleEditBio} style={{cursor:'pointer'}} size={20}/>
                                )
                            }
                        </strong>
                        {
                            editBio ?
                            <textarea name="" id="" rows="4" value={editedBio} onChange={(e)=>setEditedBio(e.target.value)}/>:
                            (
                                userProfile?.bio?
                                <article>
                                    {userProfile?.bio}
                                </article>
                                :
                                <article style={{color:'orange', display:'flex', gap:'1rem'}}>Set your bio
                                {
                                    <MdAdd onClick={toggleEditBio} style={{cursor:'pointer'}} size={iconSize}/>
                                }
                                </article>  
                            )                      
                        }
                    </div>
                    <button className='save' onClick={submitEditedProfile} style={{}}>Save</button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Profile;