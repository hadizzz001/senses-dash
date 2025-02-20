
"use client"
import Link from "next/link";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { fetchTemp1 } from './../utils'
import { useState, useEffect } from "react";





const page = () => {
    const [allTemp, setTemp] = useState<any>() 
  
    // Fetch products and categories on load
    useEffect(() => {
      fetchProducts(); 
    }, []);
  
    const fetchProducts = async () => {
      const response = await fetch('/api/order');
      if (response.ok) {
        const data = await response.json();
        setTemp(data);
      } else {
        console.error('Failed to fetch products');
      }
    };
    



    const calculateFinalTotal = (allTemp1) => {
        if (allTemp1) {
          const result = allTemp1.reduce(
            (acc, post) => {
              const price = parseInt(post.price);
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
 








    return (
        <> 
            <table className="table table-striped container">
                <thead>
                    <tr>
                        <th scope="col">Order #</th>
                        <th scope="col">Total Amount</th> 
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        allTemp && allTemp?.length > 0 ? (
                            allTemp.map((post: any, index: any) => (
                                <tr>
                                    <td>{post.id}</td>
                                    <td>${(calculateFinalTotal(post.userInfo).totalPrice + 3).toFixed(2)}</td> 
                                    <td><Link className="text-blue-700 mr-3 bg-black p-1"  href={`/order?id=${post.id}`}>View</Link></td>
                                </tr>
                            ))
                        ) : (
                            <div className='home___error-container'>
                                <h2 className='text-black text-xl dont-bold'>...</h2>

                            </div>
                        )
                    }

                </tbody>
            </table>
        </>

    )
}

export default page