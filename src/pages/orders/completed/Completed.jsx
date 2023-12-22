import React from 'react';
import './completed.css';
import OrderComponent from '../../../components/order-component/OrderComponent';
import { useOrderContext } from '../../../providers/OrderProvider';
import { HiMiniClipboardDocumentList } from "react-icons/hi2";

const Completed = () => {

    const { ordersCompleted, loading } = useOrderContext();

    return (
        loading ?
        <div className="anim-box">
            <div className="skeleton-box">
                <div className="skeleton-article"></div>
                <div className="skeleton-article"></div>
                <div className="skeleton-article"></div>
                <div className="skeleton-article"></div>                        
            </div>                    
            <div className="skeleton-box">
                <div className="skeleton-article"></div>
                <div className="skeleton-article"></div>
                <div className="skeleton-article"></div>
                <div className="skeleton-article"></div>                        
            </div>                      
        </div>:
        <div className='completed' style={{
            gridTemplateColumns: (!ordersCompleted.length > 0)?'repeat(1, 100%)':''
        }}>
            {
                ordersCompleted.length > 0 ?
                ordersCompleted.map((order, index)=>{
                    return (
                        <OrderComponent content={order} key={index}/> 
                    )
                }):
                <div className='create-task-div'>
                    <div className='child'>
                        <article>Find orders you complete here</article>
                        <HiMiniClipboardDocumentList size={120} className='placeholder-icon' />
                        {/* <article className='create-task-helper' onClick={()=>navigate('create-task')}>Create Task</article> */}
                    </div>
                </div>
            }                      
        </div>
    );
}

export default Completed;
