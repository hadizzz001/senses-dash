"use client"

import React from 'react'
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { fetchTemp3 } from '../utils'
import { useState, useEffect } from "react";




const page = () => {

    const [allTemp1, setTemp1] = useState()
    const [showDetails, setShowDetails] = useState([]);
    const searchParams = useSearchParams()
    const search = searchParams.get('id')






 


    useEffect(() => {
        const b = fetchProducts(); 
        // setShowDetails(Array(b.cartItems.length).fill(false));
      }, []);
    
      const fetchProducts = async () => {
        const response = await fetch(`/api/order/${search}`);
        if (response.ok) {
          const data = await response.json();
          setTemp1(data);
        } else {
          console.error('Failed to fetch products');
        }
      };



    const handleShowMore = (index) => {
        setShowDetails((prevShowDetails) => {
            const updatedShowDetails = [...prevShowDetails];
            updatedShowDetails[index] = !updatedShowDetails[index];
            return updatedShowDetails;
        });
    };



    // const calculateFinalTotal = () => {
    //     if (allTemp1 && allTemp1.info) {
    //         return allTemp1.info.reduce((total, post) => {
    //             const price = parseInt(post.price);
    //             const qty = post.quantity;
    //             return total + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
    //         }, 0);
    //     }
    //     return 0;
    // };





    const calculateFinalTotal = () => {
        if (allTemp1 && allTemp1.userInfo) {
            const result = allTemp1.userInfo.reduce(
                (acc, post) => {
                    const price =  post.price;
                    const qty = post.quantity;
                    acc.totalPrice += isNaN(price) || isNaN(qty) ? 0 : price * qty;
                    acc.totalItems += isNaN(qty) ? 0 : qty;
                    return acc;
                },
                { totalPrice: 0, totalItems: 0 }
            );

            return result;
        }

        return { totalPrice: 0, totalItems: 0 };
    };
    const finalTotal = calculateFinalTotal();









    console.log(allTemp1);


    return (
        <> 
            <div className="bg-gray-100 h-screen py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold mb-4">Order #{search}</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="col-md-8">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-semibold">Product</th>
                                            <th className="text-left font-semibold">Price</th>
                                            <th className="text-left font-semibold">Quantity</th>
                                            <th className="text-left font-semibold">Total</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allTemp1 && Object?.keys(allTemp1).length > 0 ? (
                                            allTemp1.userInfo.map((temp, index) => (

                                                <>
                                                    <tr>
                                                        <td className="py-4">
                                                            <div className="flex items-center"> 
                                                                <span className="font-semibold">{temp.title}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">${temp.price}</td>
                                                        <td className="py-4">
                                                            <div className="flex items-center">
                                                                <span className="text-center w-8">{temp.quantity}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">${temp.quantity * +temp.price}</td>

                                                        

                                                    </tr>
 


                                                </>
                                            ))

                                        ) : (
                                            <div className='home___error-container'>
                                                <h2 className='text-black text-xl dont-bold'>...</h2>

                                            </div>
                                        )}



                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">Customer Details</h2>

                                {allTemp1 && Object?.keys(allTemp1).length > 0 ? (
                                    <>
                                        <div className="flex justify-between mb-2">
                                            <span>Name</span>
                                            <span>{allTemp1.cartItems.fname} {allTemp1.cartItems.lname}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Phone</span>
                                            <span>{allTemp1.cartItems.phone}</span>
                                        </div> 
                                        <div className="flex justify-between mb-2">
                                            <span>Address</span>
                                            <span>{allTemp1.cartItems.address}</span>
                                        </div> 
                                        <hr className="my-2" />
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold">Total Items</span>
                                            <span className="font-semibold">{finalTotal.totalItems}</span>
                                        </div> 
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold">Total Amount</span>
                                            <span className="font-semibold">${(finalTotal.totalPrice)+3}</span>
                                        </div> 
                                    </>
                                ) : (
                                    <div className='home___error-container'>
                                        <h2 className='text-black text-xl dont-bold'>...</h2>

                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page