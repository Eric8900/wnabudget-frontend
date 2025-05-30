import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Footer() {
    return (
        <div>
            <div className="flex flex-col justify-center items-center p-4 bottom-0 w-full">
                <Image
                    src="/apple-touch-icon.png"
                    alt="Logo"
                    width={90}
                    height={90}
                    priority
                />
                <div className='font-extrabold'>WNAB</div>
                <div>
                    Built with ❤️️ by {" "}
                    <Link href={'https://github.com/Eric8900'} target="_blank" rel="noopener noreferrer" className='hover:underline text-secondary'>
                        Eric
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Footer