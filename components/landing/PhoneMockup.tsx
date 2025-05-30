'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from "framer-motion";

export default function PhoneMockup() {
    return (
        <div
            className="relative z-0"
        >
            <Image
                src={"https://cdn.prod.website-files.com/640f69143ec11b21d42015c6/672188c512264aa81f920114_flying_money_narrow_firefly_hero.svg"}
                alt={'Money'}
                width={200}
                height={900}
                className='w-full h-full scale-[120%] lg:scale-[170%] absolute z-1' />
            {/* Phone Frame */}
            <motion.div className="relative w-80 h-[600px] bg-text rounded-[3rem] p-2 shadow-2xl"
                style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                }}
                initial={{
                    rotateY: -10,
                    rotateX: 10,
                    rotateZ: 10
                }}
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}>
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="bg-white h-12 flex items-center justify-between px-6 pt-2">
                        <div className="text-black text-sm font-medium">9:41</div>
                        <div className="flex space-x-1">
                            <div className="w-4 h-2 bg-black rounded-sm"></div>
                            <div className="w-4 h-2 bg-black rounded-sm"></div>
                            <div className="w-6 h-2 bg-black rounded-sm"></div>
                        </div>
                    </div>

                    {/* App Content */}
                    <div className="px-6 py-4">
                        {/* Header */}
                        <div className="mb-6 bg-green-200 p-1 rounded-lg flex gap-3">
                            <div>
                                <div className="text-3xl font-bold text-text">$1,000</div>
                                <div className="text-sm text-text">Ready to Assign</div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <button className="bg-primary px-4 py-2 rounded-lg text-sm font-medium">
                                    Assign Money
                                </button>
                            </div>
                        </div>

                        {/* Budget Categories */}
                        <div className="space-y-4">
                            <div className="text-gray-600 font-medium">Monthly</div>

                            {/* Mortgage */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                                        🏠
                                    </div>
                                    <span className="text-gray-800">Mortgage</span>
                                </div>
                                <span className="font-bold text-gray-800">$1,200</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-accent h-2 rounded-full w-full"></div>
                            </div>

                            {/* Electric */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                                        ⚡
                                    </div>
                                    <span className="text-gray-800">Electric</span>
                                </div>
                                <span className="font-bold text-gray-800">$450</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-accent h-2 rounded-full w-4/5"></div>
                            </div>

                            {/* Phone */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                        📱
                                    </div>
                                    <span className="text-gray-800">Phone</span>
                                </div>
                                <span className="font-bold text-gray-800">$70</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-accent h-2 rounded-full w-3/4"></div>
                            </div>

                            {/* Goals Section */}
                            <div className="pt-4">
                                <div className="text-gray-600 font-medium mb-4">Goals</div>

                                {/* Vacation */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                                            🏖️
                                        </div>
                                        <span className="text-gray-800">Vacation</span>
                                    </div>
                                    <span className="font-bold text-primary">$1,850</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-primary h-2 rounded-full w-2/3"></div>
                                </div>

                                {/* New Laptop */}
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                            💻
                                        </div>
                                        <span className="text-gray-800">New Laptop</span>
                                    </div>
                                    <span className="font-bold text-primary">$625</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-primary h-2 rounded-full w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
                        <div className="flex justify-around items-center">
                            <div className="text-accent">📊</div>
                            <div className="text-gray-400">🏦</div>
                            <div className="text-gray-400">➕</div>
                            <div className="text-gray-400">📈</div>
                            <div className="text-gray-400">❓</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
