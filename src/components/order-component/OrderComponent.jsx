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
    <div onClick={()=>navigate(`./order/${orderId}`)} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"> {
                        (content.title.length > maxCharsToDisplay)?`${(content.title).slice(0,60)}...`:
                        content.title
                    }
            </h5>
        </a>
            <div class="inline-flex items-center text-blue-600 hover:underline">
            {content.category}
            </div>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${content.amount}</p>
                {
                    status === 'Completed'?
                    <div className='fx-end'>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">completed</p>
                    </div>:
                    <div className='fx-end'>
                        <article class="inline-flex items-center px-3 py-2 text-sm font-medium text-center " style={{
                            color: deadlinePased?`red`:'',
                            backgroundColor: deadlinePased?`#f7fafc`:''
                        }}>
                            {deadline}
                        </article>
                    </div>
                }                
    </div>
    );
}

export default OrderComponent;
