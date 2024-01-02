import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkDeadline, formatDeadline } from '../../../utils/helpers/DeadlineFormat';


const OrderComponent = ({ content }) => {
    const navigate = useNavigate();
    const orderId = content.id;

    const deadline = formatDeadline(content.deadline);
    const deadlinePased = checkDeadline(content.deadline);

    const status = content.status;

    const maxCharsToDisplay = 70;

    return (
        <div className='order-content' onClick={()=>navigate(`../order/${orderId}`)}>
            <div className='title-box'>
                <article>
                    {
                        (content.title.length > maxCharsToDisplay)?`${(content.title).slice(0,60)}...`:
                        content.title
                    }
                </article>
            </div>
            <div className='bottom-box'>
                <div className='fx-start'>
                    <article>{content.category}</article>    
                    <article>${content.amount}</article>
                </div>
                {
                    status === 'Completed'?
                    <div className='fx-end'>
                        <article className='deadline'>Completed</article>
                    </div>:
                    <div className='fx-end'>
                        <article className='deadline' style={{
                            color: deadlinePased?`red`:'',
                            backgroundColor: deadlinePased?`#f7fafc`:''
                        }}>
                            {deadline}
                        </article>
                    </div>
                }                
            </div>                
        </div> 
    );
}

export default OrderComponent;