import "./client-profile.css"

const ClientProfile = () => {
    const clientData = {
        "username": "client",
        "first_name": "C",
        "last_name": "Client",
        "is_verified": "False",
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
    
  return (
    <div className="client-prof-container">
        <div className="top">
            <div className="profile-pic">
                <img src="https://via.placeholder.com/150" alt="profile-pic"/>
            </div>
            <h1>{clientData.username}</h1>
        </div>
        <div className="bottom">
            <div className="bottom-left">
                <h3 className="text-sky-300 font-semibold">Personal Information</h3>
                <p><span className="text-sky-300">First Name:</span> {clientData.first_name}</p>
                <p><span className="text-sky-300">Last Name:</span> {clientData.last_name}</p>
                <p><span className="text-sky-300">Is Verified:</span> {clientData.is_verified}</p>
                <p><span className="text-sky-300">Orders Count:</span> {clientData.orders_count}</p>
            </div>
            <div className="bottom-right">
                <h3 className="text-sky-300 font-semibold">Additional Information</h3>
                <p><span className="text-sky-300">Bio:</span> {clientData.bio}</p>
                <p><span className="text-sky-300">Country:</span> {clientData.address.country}</p>
                <p><span className="text-sky-300">Timezone:</span> {clientData.address.timezone}</p>
            </div>
        </div>
    </div>
  )
}

export default ClientProfile
