import { MdVerified, MdPendingActions, MdOutlineAddTask, MdTaskAlt } from "react-icons/md";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

const ClientProfile = () => {
    const clientData = {
        "username": "client",
        "first_name": "John",
        "last_name": "Doe",
        "is_verified": "True",
        "orders_count": 1,
        "in_progress": 0,
        "completed": 0,
        "bio": "I am a client",
        "profile_photo": null,
        "address": {
            "countryCode": "KE",
            "country": "Kenya",
            "timezone": "Africa/Nairobi"
        },
        "orders": []
    }

    const iconSize = 20;

    return (
        <div className='flex'>
            <div className='flex-1 flex flex-col'>
                <div className='p-4 my-4'>
                    <div className='flex gap-3 items-center'>
                        {                    
                            clientData.profile_photo ?
                            <img className='' src={clientData.profile_photo} alt="profile-cover" /> :
                            <label className='bg-sky-300 rounded-full w-16 p-4 text-center text-white text-2xl'>{ clientData && `${(clientData.username.charAt(0).toUpperCase() + clientData.username.slice(1).slice(0,1))}`}</label>
                        }
                        <div className='space-y-1 text-gray-600'>
                            <article className='' style={{fontWeight:'bold', display:'flex', gap:'1rem', alignItems:'center', color:'#f7fafc'}}>
                                {clientData.username} 
                                {
                                    (clientData.is_verified === 'True') && <MdVerified className='' size={iconSize}/>
                                }
                            </article>
                            <article className='text-white'>{clientData.first_name}{" "}{clientData.last_name}</article>
                        </div>
                    </div>
                    <div className="address text-white">
                        <div className="address-element">
                            {clientData.address.country ? (
                                <>
                                <article>{clientData.address.country}</article>
                                <article>
                                    {getUnicodeFlagIcon(`${clientData.address.countryCode}`)}
                                </article>
                                </>
                            ) : (
                                <span>Loading Country</span>
                            )}
                        </div>
                        <div className="address-element">
                            <span>Time Zone: </span>
                            {clientData.address.timezone}
                        </div>
                    </div>
                    <div className='prof-summary flex flex-wrap gap-4 w-full items-center mt-4'>
                        <div className='prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <MdTaskAlt className='text-white' size={iconSize}/>
                                <article className='text-white'>Total Orders</article>
                            </div>
                            <span className=''>{clientData.orders_count}</span>
                        </div>
                        <div className='prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <MdPendingActions className='text-white' size={iconSize}/>
                                <article className='text-white'>Orders in Progress</article>
                            </div>
                            <span className=''>{clientData.in_progress}</span>
                        </div>
                        <div className='prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <MdOutlineAddTask className='text-white' size={iconSize}/>
                                <article className='text-white'>Orders completed</article>
                            </div>
                            <span className=''>{clientData.completed}</span>
                        </div>
                    </div>
                    <div className='mt-5 flex flex-col space-y-2 mb-4'>
                        <div className='bio'>
                            <strong>Bio</strong>
                            <article>{clientData.bio}</article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientProfile;
