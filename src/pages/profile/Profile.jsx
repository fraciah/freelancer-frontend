import React from 'react';
import { useState, useRef } from 'react';
import { useAuthContext } from '../../providers/AuthProvider';
import { useOrderContext } from '../../providers/OrderProvider';
import { MdVerified, MdPendingActions, MdOutlineAddTask } from "react-icons/md";
import { MdAccessTime, MdTaskAlt } from "react-icons/md";
import { MdModeEdit, MdAdd  } from "react-icons/md";
import { timeAgo } from '../../../utils/helpers/TimeAgo';
import Transaction from '../../components/transactions/Transaction';
import PulseLoader from "react-spinners/PulseLoader";
import ProfilePlaceholder from '../../components/profile-placeholder/ProfilePlaceholder';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import './profile.css';

const Profile = () => {
    const { loadingUserProfile, loadedUserProfile, submitNewBio, uploadProfilePhoto, userToken } = useAuthContext();

    const [userProfile, setUserProfile] = useState(loadedUserProfile);

    const { ordersCompleted, ordersInProgress, } = useOrderContext();

    const [editBio, setEditBio] = useState(false);
    const [editedBio, setEditedBio] = useState(userProfile?.bio);

    const { orders } = useOrderContext();
    console.log("orders",orders);

    const [transactions, setTransactions] = useState();
    const [loadingTransactions, setLoadingTransactions] = useState(true);

    const toggleEditBio = () => {
        setEditBio(userProfile?.bio);
        setEditBio(!editBio);
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

    const getTransactions = async() => {
        const transactionUrl = `${import.meta.env.VITE_API_URL}/transactions`
        try {
            const retrieveTransactions = await fetch(transactionUrl, {
                headers: {
                    'content-Type':'application/json',
                    'authorization':`Bearer ${userToken}`
                }
            })

            if (retrieveTransactions.ok) {
                const transactions = await retrieveTransactions.json();
                setTransactions(transactions)
                console.log(transactions);
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingTransactions(false)
        }
    }

    const iconSize = 25;

    useState(()=>{
        userToken && getTransactions()
    },[])

    return (
    <div className='flex'>
        <div className='flex-1 flex flex-col'>
            <div className='p-4 my-4'>
                <div className='flex gap-3 items-center'>
                <ProfilePlaceholder
                    uploadProfilePhoto={uploadProfilePhoto}
                    userProfile={userProfile}
                    loadingUserProfile={loadingUserProfile}
                    setUserProfile={setUserProfile}/>
                <div className='space-y-1 text-gray-600'>
                    <article className={loadingUserProfile?'username-skeleton':''} style={{fontWeight:'bold', display:'flex', gap:'1rem', alignItems:'center',color:'#f7fafc'}}>
                        {userProfile?.username} 
                        {
                            (userProfile?.is_verified === 'True') && <MdVerified className='' size={iconSize}/>
                        }
                    </article>
                    <article className='text-white' style={{
                        animation: loadingUserProfile?`skeleton-loading 1s linear infinite alternate`:''
                    }}>{userProfile?.email}</article>
                </div>
                </div>
                <div className='prof-summary flex flex-col sm:flex-row gap-4 w-full items-center mt-4'>
                    <div className='prof-element justify-between p-4 border border-sky-300 flex items-center w-full sm:flex-1 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <MdTaskAlt className='text-sky-300' size={iconSize}/>
                            <article className='text-white'>Total Orders</article>
                        </div>
                        <span className=''>{userProfile?.orders_count}</span>
                    </div>
                    <div className='prof-element justify-between p-4 border border-sky-300 flex items-center w-full sm:flex-1 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <MdPendingActions className='text-sky-300' size={iconSize}/>
                            <article className='text-white'>Orders in Progress</article>
                        </div>
                        <span className=''>{ordersInProgress.length}</span>
                    </div>
                    <div className='prof-element justify-between p-4 border border-sky-300 flex items-center w-full sm:flex-1 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <MdOutlineAddTask className='text-sky-300' size={iconSize}/>
                            <article className='text-white'>Orders completed</article>
                        </div>
                        <span className=''>{ordersCompleted?.length}</span>
                    </div>
                    <div className='prof-element justify-between p-4 border border-sky-300 flex items-center w-full sm:flex-1 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <MdAccessTime className='text-sky-300' size={iconSize}/>
                            <article className='text-white'>Last Login</article>
                        </div>
                        <article className='text-white'>{userProfile ? timeAgo(userProfile?.last_login):'---'}</article>
                    </div>
                </div>
                <div className='mt-5 flex flex-col space-y-2 mb-4'>
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
                            <textarea  name="" id="" rows="4" value={editedBio} onChange={(e)=>setEditedBio(e.target.value)}
                            style={{
                                resize:'none',
                                border:'none',
                                width:'100%',
                                padding:'4px',
                                outline:'none',
                                color: '#535354',
                                backgroundColor: '#f7fafc', 
                            }}
                            />:
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
                {
                loadingTransactions ?
                <div>
                    <PulseLoader size={10}  color='#7fc2f5' />
                </div>:
                
                transactions?.length > 0 &&
                <>
                    <article>My Transactions</article>
                    <Transaction transactions={transactions} user={userProfile?.username} />                             
                </>
            }
            </div>
        </div>
    </div>
    );
}

export default Profile;