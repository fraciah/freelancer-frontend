import React from 'react';
import './orderview.css';
import { IoMdDownload } from "react-icons/io";
import Chat from '../../../components/chat/Chat';
import { MdModeEdit } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { useOrderContext } from '../../../providers/OrderProvider';
import { timeAgo } from '../../../../utils/helpers/TimeAgo';
import { MdAdd } from "react-icons/md";
import { useState } from 'react';
import { useNavigate, } from 'react-router-dom';
import { useEffect } from 'react';
import { useRef } from 'react';
import { VscFile } from "react-icons/vsc";
import OrderSkeletonLoading from '../../loading/OrderSkeletonLoading';
import PulseLoader from "react-spinners/PulseLoader";
import { useAuthContext } from '../../../providers/AuthProvider';

const OrderView = () => {

    const ordersUrl = `${import.meta.env.VITE_API_URL}/orders/`

    const { userToken } = useAuthContext();

    const navigate = useNavigate();


    const fileInputRef = useRef(null);
    
    const iconSize = 17;

    const {orderId} = useParams();

    const {loadingAttachemnt, completeOrder, getAllOrders, uploadAttachment } = useOrderContext();

    const [orderContent, setOrderContent] = useState();

    const [loading, setLoading] = useState(true);
      
    const uploadedAt = timeAgo(orderContent?.solution?.created);
 
    const [solutionType, setSolutionType] = useState('Draft'); 

 


    const changeOrderStatus = () => {
        completeOrder(orderId)
        .then((data)=>{
            const updatedOrder = {
                ...orderContent, 
                status:data.status
            }
            orderContent.status = data.status;
            setOrderContent(updatedOrder);            
        })
        getAllOrders();
    }

    const openFileDialog = () => {
        console.log("Opening file dialog");
        if(fileInputRef.current){
            fileInputRef.current.click();
        }
    }

    const uploadAttachmentFile = (e) => {
        const attachment = e.target.files[0];
        console.log("Submitted");
        if (attachment) {
            if (attachment.size <= 20 *1024 *1024){
                uploadAttachment(attachment, orderId, solutionType)
                .then((res)=>{
                    const attachmentUrl = res?.solution;

                    const updatedOrder = {
                        ...orderContent, solution: attachmentUrl
                    }

                    orderContent.solution = attachmentUrl;

                    setOrderContent(updatedOrder);

                })
            }
            else {
                console.log("Select lower size file");
            }
        } else {
            console.log("Select correct file format");
        }
    }

    const downloadFile = () => {
        const link = document.getElementById('solution-file');
        link.download = (orderContent?.solution.solution)
            .substring(orderContent?.solution.solution.lastIndexOf('/')+1);
        link.click();
    } 
      
      

    const getOrder = async(orderId) => {  
        try {
            const getOrderById = await fetch(`${ordersUrl}${orderId}`, {
                method:'get',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${userToken}`
                },            
            })

            if (getOrderById.ok){
                const orderDetails = await getOrderById.json();
                setOrderContent(orderDetails);                
            } else {
                const status = getOrderById.status;
                if (status===401){
                    navigate(`/login?order=${orderId}`);                    
                }
            }
            // return orderDetails;

        } catch (error){
            console.log(error);
            
        } finally {
            setLoading(false);     
        }
    }    

    useEffect(()=>{
        console.log("Getting order.....")
        // getOrder(orderId).then((data)=>{
        //     setOrderContent(data);
        // })
        // orderId && navigate(`./orders/${orderId}`)
        getOrder(orderId);
    }, [orderId,]);

    return (                
        <div className='order-view'>
            {
                loading ?
                <OrderSkeletonLoading />                
                :
                orderContent && 
                (
                <>
                    <div className='order-details'>
                        <strong style={{fontWeight:'bold'}}>{orderContent?.title}</strong>            
                        <div className='order-elements'>
                            <article>{orderContent?.category}</article>
                            <strong>{!loading && ('$'+orderContent?.amount)}</strong>
                            <article className='status'>{orderContent?.status}</article>                   
                        </div> 
                        <h2 className="card-jobtitle">by <a href=""><span>{orderContent.client.user.username}</span></a></h2>
                                                                         
                            
                        <div className='order-soln'>
                        {orderContent?.solution && loadingAttachemnt ? (
    <div className="h-6 w-full rounded-md bg-indigo-100 animate-pulse"></div>
) : (
    <div className='flex items-center justify-between h-6'>
        <strong className="h-6">
            {orderContent?.solution ? 'Solutions' : 'Solutions'}
            {orderContent?.status === 'In Progress' && (
                <>
                    <input
                        onChange={uploadAttachmentFile}
                        ref={fileInputRef}
                        className="hidden"
                        size={20 * 1024 * 1024}
                        type="file"
                        name=""
                        id=""
                    />
                    <span className='ml-6 text-sm text-gray-500 '>solution type:</span>
                    <select
                        onChange={(e) => setSolutionType(e.target.value)}
                        value={solutionType}
                        className="ml-2 border rounded-md text-sm "
                    >
                        <option value="Draft">Draft</option>
                        <option value="Final">Final</option>
                    </select>
                </>
            )}
        </strong>
    </div>
)}

    {!orderContent?.solution && orderContent?.status === 'In Progress' && (
    <div className='upload-div' style={{ color: 'orange' }}>
      <article onClick={openFileDialog}>
        <VscFile className='file-icon' size={iconSize} />
        Upload your draft or final solution
        <input onChange={uploadAttachmentFile} ref={fileInputRef} className="hidden" size={20 * 1024 * 1024} type="file" name="" id="" />
      </article>
    </div>
  )}
  {orderContent?.solution && (
    <div className="solution-details mt-2 flex items-center gap-8 text-xs ml-[200px] pb-6 justify-end">
            <a href={orderContent?.solution?.solution} id='solution-file' rel="noopener noreferrer" download className="block rounded-lg p-4 shadow-sm bg-white" >
                {typeof orderContent?.solution?.solution === 'string' ?
                 orderContent?.solution?.solution.substring(orderContent?.solution?.solution.lastIndexOf('/') + 1)
                : ''}
                    <div className="mt-2">
                    <dl>
                        <div>
                            <dt className="sr-only">Type</dt>
                            <dd className="text-sm text-gray-500">{orderContent?.solution?._type}</dd>
                        </div>
                    </dl>
                </div>
            </a>
            <IoMdDownload onClick={downloadFile} className='cursor-pointer' size={iconSize} />
            <span className='text-gray-500 '>{uploadedAt}</span>
        </div>
        )}
    </div>

                        <div className="instructions">
                            <strong>
                                {
                                    orderContent?.status ==='In Progress'?
                                    (orderContent?.instructions ? 'Instructions':  ('No instructions available at the moment.')):
                                    orderContent?.status ==='Completed' && 'Instructions'
                                } 
                               
                            </strong>
                            {                                                
                                (
                                                             
                                    
                                        orderContent?.instructions &&
                                        <div>                            
                                            <article>                                    
                                                {orderContent?.instructions}
                                            </article>                                                        
                                        </div>
                                    
                                )
                            }
                        </div>
                        {
                            orderContent?.status ==='Completed' && !orderContent?.attachment?null:
                            <div className='attachments'>
                            {orderContent?.attachment && loadingAttachemnt ? (
                              <div style={{ height: '1.5rem' }}>
                                
                              </div>
                            ) : (
                              <strong style={{ height: '1.5rem' }}>
                                {orderContent?.attachment ? 'Attachments' : 'Attachments'}
                                {orderContent?.status === 'In Progress' }
                              </strong>
                            )}
                            {!orderContent?.attachment && orderContent?.status === 'In Progress' && (
                              <div className='upload-div'>
                                <article onClick={openFileDialog}>
                                  No Attachments available at the moment.
                                </article>
                              </div>
                            )}
                            {orderContent?.attachment && (
                              <div>
                                <a href={orderContent?.attachment} target='_blank' download>
                                  {orderContent?.attachment.substring(orderContent?.attachment.lastIndexOf('/') + 1)}
                                </a>
                              </div>
                            )}
                          </div>
                        }
                    </div>
                    <Chat orderId={orderId} client={orderContent.client} freelancer={orderContent.freelancer} />
                </>                
                )
                
            }
            
        </div>
    );
}

export default OrderView;
