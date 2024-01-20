import React from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../../utils/helpers/TimeAgo';
import './transaction.css';

const Transaction = ({transactions, user}) => {
    const navigate = useNavigate();
    // console.log("Transactions",transactions)
    
    return (
        <div>
            <table className='transaction-table'>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Mode</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>                    
                </thead>
                <tbody>
                    {
                        transactions?.map((transaction, index)=>{
                            return (
                                <tr className='transaction' onClick={() => navigate(`../order/${transaction.order}`)}>
                                    <td>{transaction._from}</td>
                                    <td>{transaction._to}</td>
                                    <td>
                                        {
                                            user === transaction._from &&
                                            <>-</> ||
                                            user === transaction._to &&
                                            <>+</>
                                        }
                                        ${transaction.amount_value}
                                    </td>
                                    <td>{transaction.channel}</td>                                    
                                    <td>{transaction.status}</td>
                                    <td>{timeAgo(transaction.timestamp)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>            
        </div>
    );
}

export default Transaction;
