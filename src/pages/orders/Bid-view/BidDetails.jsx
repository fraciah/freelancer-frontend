
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../../providers/AuthProvider';
import { toast } from 'react-hot-toast';

const BidDetailsPage = () => {
  const { orderId, bidId } = useParams();
  const { userToken } = useAuthContext();
  const [bidDetails, setBidDetails] = useState({});
  const [updatedBidAmount, setUpdatedBidAmount] = useState(bidDetails.amount || 0);

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/49c38b40-c063-4a28-aea0-177afce16559/bid/`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch bid details:', response.statusText);
          return;
        }

        const bid = await response.json();
        setBidDetails(bid);
        setUpdatedBidAmount(bid.amount);
      } catch (error) {
        console.error('Error fetching bid details:', error.message);
      }
    };

    fetchBidDetails();
  }, [orderId, userToken]);

  const handleUpdateBid = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/49c38b40-c063-4a28-aea0-177afce16559/bid/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ amount: updatedBidAmount }),
      });

      if (response.ok) {
        toast.success('Bid updated successfully');
      } else {
        console.error('Failed to update bid:', response.statusText);
        toast.error('Failed to update bid');
      }
    } catch (error) {
      console.error('Error updating bid:', error.message);
      toast.error('Error updating bid');
    }
  };

  return (
    <div>
      <h1>Bid Details</h1>
      <p>Bid Amount: {bidDetails.amount}</p>
      {/* Display other bid details as needed */}

      <label htmlFor="updatedBidAmount">Update Bid Amount:</label>
      <input
        type="number"
        id="updatedBidAmount"
        value={updatedBidAmount}
        onChange={(e) => setUpdatedBidAmount(parseFloat(e.target.value))}
      />

      <button type="button" onClick={handleUpdateBid}>
        Update Bid
      </button>
    </div>
  );
};

export default BidDetailsPage;
