import React, { useEffect } from 'react';
import { useOrderContext } from '../../providers/OrderProvider';
import OrderComponent from '../../components/order-component/OrderComponent';

const FreelancerDashboard = () => {
  const { orders, loading } = useOrderContext();

  return (
    <div className="flex h-screen bg-gray-100 pt-[50px]">
      {/* Sidebar */}
      
    <div class="hidden md:flex flex-col w-64 bg-white rounded-lg">
        <div class="flex flex-col flex-1 overflow-y-auto">
            <nav class="flex-1 px-2 py-4 bg-[#7fc2f5] rounded-lg">
                <a href="#" class="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Dashboard
                </a>
                <a href="#" class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    In progress
                </a>
                <a href="#" class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Completed
                </a>
                <a href="#" class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    solved
                </a>
            </nav>
        </div>
    </div>


      {/* Dashboard content */}
      <div className="flex-1 overflow-x-hidden ">
        {loading ? (
          <div class="card loading">
          <div class="content">
            <h4></h4>
            <div class="description">
            </div>
          </div>
        </div>
        ) : orders.length === 0 ? (
           <section className="flex items-center h-full sm:p-16 dark:bg-gray-900 dark:text-gray-100">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <p className="text-xl">There are no orders currently. Try again later.</p>
              <a rel="noopener noreferrer" href="#" className="px-8 py-3 font-semibold rounded bg-blue-400 dark:text-gray-900">
                Back to homepage
              </a>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <OrderComponent key={order.id} content={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
