import React from 'react';
import OrderComponent from '../../../components/order-component/OrderComponent';
import { useOrderContext } from '../../../providers/OrderProvider';
import { useNavigate } from 'react-router-dom';
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import LoadingSkeletonOrder from '../../loading/Loading';
import { useEffect } from 'react';

const Available = () => {
    const {getOrdersAvailable, ordersAvailable, loading} = useOrderContext();

    useEffect(()=>{
        getOrdersAvailable()
    },[])

    // const navigate = useNavigate();
    return (
        loading?
        <LoadingSkeletonOrder />:
        <div className='main-available'>             
            {                
                (ordersAvailable.length > 0)?
                ordersAvailable.map((order, index)=>{
                    return (
                        <OrderComponent key={index} content={order}/>
                    )
                }):
                <div className='create-task-div'>
                    <div className='child'>
                        <article>There are no available orders!</article>
                        
                    </div>
                </div>
            }
        </div>           
            
    );
}

export default Available;