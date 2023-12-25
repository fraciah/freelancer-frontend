import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkDeadline, formatDeadline } from '../../../utils/helpers/DeadlineFormat';

const OrderComponent = ({ content }) => {
  const navigate = useNavigate();
  const orderId = content.id;

  const deadline = formatDeadline(content.deadline);
  const deadlinePassed = checkDeadline(content.deadline);

  const status = content.status;

  const maxCharsToDisplay = 70;


  return (
    
    <div className='pt-[30px] mt-4 pl-3 flex '  onClick={()=>navigate(`./order/${orderId}`)}>
      <a
  href="#"
  class="relative block overflow-hidden rounded-lg border bg-gray-200 border-gray-100 sm:p-6 lg:p-8"
>
  <span
    class="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"
  ></span>

  <div class="sm:flex sm:justify-between sm:gap-4">
    <div>
      <h3 class="text-lg font-bold text-gray-900 sm:text-xl">
      {
                        (content.title.length > maxCharsToDisplay)?`${(content.title).slice(0,60)}...`:
                        content.title
                    }
      </h3>

      <p class="mt-1 text-xs font-medium text-gray-600">
        category: {content.category}
        </p>
    </div>

    <div class="sm:block sm:shrink-0">
    ${content.amount}
    </div>
  </div>

  <div class="mt-4">
    <p class=" text-sm text-gray-500">
     {content.instructions}
    </p>
  </div>

  <dl class="mt-6 flex gap-4 sm:gap-6">
    {
                    status === 'Completed'?
                    <dd class="text-xs text-gray-500 flex flex-col-reverse">completed on</dd>:
                    <div className='fx-end'>
                        <dd className='text-xs ' style={{
                            color: deadlinePassed?`text-red-500 `:'',
                            backgroundColor: deadlinePassed?`text-gray-500`:''
                        }}>
                                <div class="flex flex-col-reverse">
      <dt class="text-sm font-medium text-gray-600">Deadline</dt>
      <dd class="text-xs text-gray-500">{deadline}</dd>
    </div>
                        </dd>
                    </div>
                }   


  </dl>
</a>
    </div>

  );
}

export default OrderComponent;
