import Link from 'next/link';
import React, { FC } from 'react';



const error:FC = ({}) => {
  return (
    <div className='flex flex-col gap-6 h-[28rem] justify-center items-center'>
      <h1 className='font-bold text-[4rem]'>404 Not Found</h1>
      <p>This page does not exist. Please go back to previous page or home page.</p>
      <Link className='btn--red px-6 py-2' href="/">Back to Home Page</Link>
    </div>
  )
};

export default error;