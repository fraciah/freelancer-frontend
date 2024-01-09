import React from 'react';
import { useNavigate } from 'react-router-dom'
import gigitise from "/public/gigitise.svg"

const BadToken = () => {
    const navigate = useNavigate();
    return (
        <div className="flex h-screen flex-col bg-[#f7fafc]">
            <div className="mx-auto mt-[6%] pt-10">
                <img className="w-32 h-32 rounded-full mx-auto" src={gigitise} alt="Profile picture" />
                <div className="brand-title text-3xl pt-2">Gigitise</div>
            </div>
            <div className="flex flex-1 items-center py-4 justify-center">
                <div className="mx-auto max-w-xl px-4 text-center">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Bad Link
                    </h1>
                    <p className="mt-4 text-gray-500">
                    The link you provided does not work.
                    </p>
                    <button
                        onClick={() => navigate('/reset-password')}
                        className="mt-6 inline-block rounded bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
                    >
                        Generate a new link
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BadToken;