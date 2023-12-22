import React from 'react';
import './orderview.css';
import { IoMdDownload } from "react-icons/io";
import Chat from '../../../../components/main/chat/Chat';
import { MdModeEdit } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { useOrderContext } from '../../../../providers/OrderProvider';
import { timeAgo } from '../../../../utils/helpers/TimeAgo';
import { MdAdd } from "react-icons/md";
import { useState } from 'react';
import { useNavigate, } from 'react-router-dom';
import { useEffect } from 'react';
import { useRef } from 'react';
import { VscFile } from "react-icons/vsc";
import OrderSkeletonLoading from '../../loading/OrderSkeletonLoading';
import PulseLoader from "react-spinners/PulseLoader";
import { useAuthContext } from '../../../../providers/AuthProvider';

const OrderView = () => {

    const ordersUrl = `${import.meta.env.VITE_API_URL}/orders/`

    const { userToken } = useAuthContext();

    const navigate = useNavigate();


    const fileInputRef = useRef(null);
    
    const iconSize = 17;

    const {orderId} = useParams();

    const {loadingAttachemnt, updateInstructions, completeOrder, getAllOrders, uploadAttachment } = useOrderContext();

    const [orderContent, setOrderContent] = useState();

    const [loading, setLoading] = useState(true);
      
    const uploadedAt = timeAgo(orderContent?.solution?.created);

    const [editInstructions, setEditInstructions] = useState(false);
    const [editedInstructions, setEditedInstructions] = useState(orderContent?.instructions);

    const toggleInstructionMode =  () => {
        setEditedInstructions(orderContent?.instructions);
        setEditInstructions(!editInstructions);
    }

    const handleInstructionChange = (e) => {
        setEditedInstructions(e.target.value);
    }

    const updateNewInstructions = () => {        
        updateInstructions(editedInstructions, orderId)        
        .then((data)=>{
            if (data) {
                const updatedOrder = {
                    ...orderContent,
                    instructions:data.instructions
                };    
                updatedOrder.instructions = data.instructions;            
                setOrderContent(updatedOrder);
            }
            
        })
        setEditInstructions(false);
        // setOrder(getOrder(orderId)); 
        
        // useCallback(()=>{
        //     setRefresh((prev)=>prev+1);
        // },[])
    }

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
                uploadAttachment(attachment, orderId)
                .then((res)=>{
                    const attachmentUrl = res?.attachment;

                    const updatedOrder = {
                        ...orderContent, attachment: attachmentUrl
                    }

                    orderContent.attachment = attachmentUrl;

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
                            {
                                orderContent?.status === 'In Progress' && 
                                <button onClick={changeOrderStatus} className='complete-order'>Complete Order</button>
                            }                    
                        </div>                                                  
                            <div  className='order-soln'>
                                {
                                orderContent?.solution?
                                <>
                                    <strong>Uploaded Work</strong>
                                    <div className='solutions'>
                                        {                            
                                            <div>
                                                <a href={`${orderContent?.solution?.solution}`} id='solution-file' >
                                                    {
                                                        (orderContent?.solution.solution)
                                                        .substring(orderContent?.solution.solution.lastIndexOf('/')+1)                                            
                                                    }
                                                </a>
                                                <article>{orderContent?.solution._type}</article>
                                                <IoMdDownload className='download-icon' onClick={downloadFile} style={{cursor:'pointer'}} size={iconSize}/>
                                                <article className=''>{uploadedAt}</article>
                                            </div>
                                        }                        
                                    </div>
                                </>:
                                    <strong style={{color:'orange'}}>Solution will be uploaded soon</strong>            
                                }
                            </div>                                    
                        <div className="instructions">
                            <strong>
                                {
                                    orderContent?.status ==='In Progress'?
                                    (orderContent?.instructions ? 'Instructions':  ('Add Instructions')):
                                    orderContent?.status ==='Completed' && 'Instructions'
                                } 
                                {                        
                                orderContent?.status === 'In Progress' &&  
                                (
                                    editInstructions &&(orderContent?.instructions != editedInstructions)?
                                    <button className='submit-instructions' onClick={updateNewInstructions}>Submit</button>:
                                    <MdModeEdit className='edit-icon' style={{cursor:'pointer'}} size={iconSize} onClick={toggleInstructionMode}/>
                                )
                                }
                            </strong>
                            {                                                
                                (
                                    editInstructions?
                                    <div style={{width:'100%'}}>
                                        <textarea placeholder='Tell us about your order!' name="instructions" id="instructions" value={editedInstructions} 
                                            style={{
                                                width:'inherit',
                                                padding:'0.5rem 0', 
                                                outline:'none', 
                                                border:'none'
                                            }}  
                                            rows="5" readOnly={false}  
                                            onChange={handleInstructionChange}                                  
                                        />                                
                                    </div>:                            
                                    (
                                        orderContent?.instructions &&
                                        <div>                            
                                            <article>                                    
                                                {orderContent?.instructions}
                                            </article>                                                        
                                        </div>
                                    )
                                )
                            }
                        </div>
                        {
                            orderContent?.status ==='Completed' && !orderContent?.attachment?null:
                            <div className='attachments'>
                                {
                                    orderContent?.attachment &&
                                    loadingAttachemnt ? 
                                    <div style={{height:'1.5rem'}}>
                                        <PulseLoader size={10}  color='#7fc2f5' />
                                    </div>:
                                    <strong style={{height:'1.5rem'}}>
                                        {
                                            orderContent?.attachment?'Attachments':'Attachments'
                                        }
                                        {orderContent?.status ==='In Progress' && <MdAdd onClick={openFileDialog} style={{cursor:'pointer'}} size={20}/>}
                                        <input onChange={uploadAttachmentFile} ref={fileInputRef} style={{ display: 'none' }} size={20 * 1024 * 1024} type="file" name="" id="" />
                                    </strong>
                                }
                                {
                                    !orderContent?.attachment &&
                                    orderContent?.status ==='In Progress' &&
                                    <div className='upload-div'>
                                        <article onClick={openFileDialog}>
                                            <VscFile className='file-icon' size={iconSize}/>                                
                                            Upload an attachment
                                            <input onChange={uploadAttachmentFile} ref={fileInputRef} style={{ display: 'none' }} size={20 * 1024 * 1024} type="file" name="" id="" />
                                            </article>
                                    </div>
                                }
                                {
                                    orderContent?.attachment &&
                                    <div>
                                        <a href={orderContent?.attachment} target='_blank'>
                                            {
                                                (orderContent?.attachment)
                                                .substring(orderContent?.attachment.lastIndexOf('/')+1)  
                                            }  
                                        </a>                          
                                    </div>
                                }
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
