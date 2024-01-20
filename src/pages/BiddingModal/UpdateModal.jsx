import { useParams } from 'react-router-dom';
import Modal from "./modal";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuthContext } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";


const UpdateModal = ({ showUpdateModal, setUpdateModal, orderDetails, onUpdateBid }) => {
    const [bidAmount, setBidAmount] = useState(orderDetails.amount);
    const { orderId } = useParams();
    const { userToken } = useAuthContext();
  
    useEffect(() => {
      setBidAmount(orderDetails.amount);
    }, [orderDetails]);
  
    const handleCloseModal = () => {
      setUpdateModal(false);
    };
  
    const handleBidUpdate = async (e) => {
      e.preventDefault();
      try {
        if (bidAmount < orderDetails.amount) {
          toast.error("Bid amount should be equal or greater than the client's amount.");
          return;
        }
  
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/bid/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${userToken}`
          },
          body: JSON.stringify({ amount: bidAmount }),
        });
  
        if (response.ok) {
          const updatedBid = await response.json();
          toast.success("Bid updated successfully");
          // Pass the updated bid to the parent component
          onUpdateBid(updatedBid);
        } else {
          console.error("Failed to update bid:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating bid:", error.message);
      }
    };
  
    return (
      <Modal showModal={showUpdateModal} setShowModal={setUpdateModal}>
        <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative dark:bg-gray-700">
              <form className="p-4 md:p-5" onSubmit={handleBidUpdate}>
                <div className='flex items-center mb-8'>
                  <span htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                     Update Bidding Price
                  </span>
                  <button
                    title='Close bidding'
                    type="button"
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={orderDetails?.amount ? orderDetails.amount.toFixed(2) : "0.00"}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                  />
                </div>
  
                <button
                  type="submit"
                  className="flex w-full justify-center mt-4 rounded-md bg-sky-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Update bid
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  
  export function useUpdateModal() {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
  
    const UpdateModalCallback = useCallback(
      (orderDetails, onUpdateBid) => {
        return (
          <UpdateModal
            showUpdateModal={showUpdateModal}
            setUpdateModal={setShowUpdateModal}
            orderDetails={orderDetails}
            onUpdateBid={onUpdateBid}
          />
        );
      },
      [showUpdateModal]
    );
  
    return useMemo(() => ({ setShowUpdateModal, UpdateModal: UpdateModalCallback }), [
      setShowUpdateModal,
      UpdateModalCallback,
    ]);
  }
  
