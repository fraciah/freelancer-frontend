import React from 'react';
import './order-creation.css';
import { IoMdArrowForward } from "react-icons/io";
import { categories } from '../../../../utils/helpers/OrderCategories';
import { useOrderContext } from '../../../../providers/OrderProvider';
import PulseLoader from "react-spinners/PulseLoader";
import { useRef, useState } from 'react';

const OrderCreation = () => {

    const { createOrder, submitLoading } = useOrderContext();  
    const [titleLimit, setTitleLimit] = useState(false);
    const maxChars = 80;
    const titleRef = useRef('');

    const getTitleLength = () => {
        const title = titleRef.current.value;
        if (title.length === maxChars) {
            setTitleLimit(true);
            return
        }
        setTitleLimit(false);
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };
    
    const currentDate = new Date();
    
    // Add 3 hours to the current date
    const modifiedDate1 = new Date(currentDate.getTime());
    modifiedDate1.setHours(currentDate.getHours() + 3);
    const minDate = formatDate(modifiedDate1);
    
    // // Add 3 months to the current date
    // const modifiedDate2 = new Date(currentDate.getTime());
    // modifiedDate2.setMonth(currentDate.getMonth() + 3);
    // const maxDate = formatDate(modifiedDate2);
    
    // console.log(minDate, maxDate);

    return (
        <div className='order-creation'>
            <strong>Create a new order</strong>
            <form className='order-creation-details' onSubmit={(e)=>createOrder(e)}>
                <div className='order-required-details'>
                    <div>
                        {/* <div> */}
                            <label htmlFor="title">Title</label>
                        {/* </div> */}
                        <input style={{
                            outlineColor:titleLimit && 'orange',
                            borderColor:titleLimit && 'orange'
                        }}
                         required ref={titleRef} onChange={getTitleLength} maxLength={maxChars}  id='title' type="text" placeholder='Enter the title' 
                        />
                        {
                            titleLimit && <span className='text-limit-helper'>Reached title limit</span>
                        }

                    </div>
                    <div>
                        {/* <div> */}
                            <label htmlFor="category">Category</label>
                        {/* </div> */}
                        <select required name="category" id="category">
                            {
                                categories.map((category, index)=>{
                                    return <option key={index} value={category}>{category}</option>
                                })
                            }                            
                        </select>
                    </div>
                    <div>
                        {/* <div> */}
                            <label htmlFor="file">Upload file</label>   
                        {/* </div> */}
                        <input id='attachment' type="file" accept='' />
                    </div>
                    <div>
                        {/* <div> */}
                            <label htmlFor="deadline">Deadline</label>
                        {/* </div> */}
                        <input required type="datetime-local" id='deadline' min={minDate}/>
                    </div>
                </div>                
                <div className='instructions-box'>
                    <div>
                        <label htmlFor="instructions">Instructions</label>
                    </div>
                    <textarea rows={4} type="text" id='instructions' placeholder='Tell us more about your task'/>
                </div>
                <div className='amount-box'>
                    <div>
                        <label htmlFor="amount">Amount ($)</label>
                    </div>
                    <input required type="number" id='amount' placeholder='$' min={1}/>                    
                </div>
                <div style={{
                    padding:'1rem 0',
                    height:'2rem'
                }}>
                    {
                        submitLoading ? 
                        <PulseLoader color='#7fc2f5' />:
                        <button type='submit' className='create-task'>                        
                            Create <IoMdArrowForward  size={20}/>                        
                        </button>
                    }                    
                </div>                                              
            </form>            
        </div>
    );
}

export default OrderCreation;
