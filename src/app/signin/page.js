import { SignInButton } from '@clerk/nextjs'
import React from 'react'

function SignIn() {
  return (
    <div className='flex justify-center items-center h-screen'>
        <SignInButton className="bg-white p-4 pl-16 pr-16 text-black"/>
    </div>
  )
}

export default SignIn