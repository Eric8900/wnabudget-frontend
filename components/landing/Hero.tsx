import Image from 'next/image'
import React from 'react'
import PhoneMockup from './PhoneMockup'
import { Button } from '../ui/button'
import Link from 'next/link'

function Hero() {
    return (
        <div className='h-screen'>
            <Image
                src={'https://cdn.prod.website-files.com/640f69143ec11b21d42015c6/6776d0feb0dad6298ff22ba1_bkg_home_tissuepaper_noise.avif'}
                alt={'hero'}
                width={1920}
                height={1080}
                className='object-cover z-[-1] w-screen h-11/12 absolute' />
            <div className='px-[7%]'>
                <div className='flex flex-col lg:flex-row justify-center gap-10'>
                    <div className='lg:text-left text-center text-text-foreground lg:mt-[10%] lg:py-10 py-[15%]'>
                        <h1 className='lg:text-6xl text-5xl font-bold'>
                            How will you spend your <span className='line-through decoration-accent'>money</span> life?
                        </h1>
                        <p className='text-xl font-medium my-10'>
                            Create a friendly, flexible plan and spend it well with WNAB.
                        </p>
                        <Link href={"/login"}>
                            <Button className='text-base py-7 px-5 font-bold'>Start Your Plan Now</Button>
                        </Link>
                        <p className='text-sm font-bold mt-10'>It&apos;s easy! No credit card required.</p>
                    </div>
                    <div className='p-[10%] pl-[15%] hidden lg:block'>
                        <PhoneMockup />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero