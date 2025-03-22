
"use client"
import Link from "next/link";
import ExportButton from "../components/ExportExcel";
import { useState, useEffect } from "react";
import { redirect, useRouter } from 'next/navigation';





const page = () => {
  const [allTemp, setTemp] = useState<any>()
  const [updatedNums, setUpdatedNums] = useState({});

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




  const calculateFinalTotal = (idd) => {
    if (!allTemp || !allTemp.userInfo || allTemp.userInfo.length === 0) {
      return { totalItems: 0 };
    }

    const filteredOrders = allTemp.userInfo.filter(order => order.id === idd);

    return {
      totalItems: filteredOrders.reduce((acc, post) => acc + (isNaN(post.quantity) ? 0 : post.quantity), 0),
    };
  };







  const handlePaymentUpdate = async (id) => {
    try {
      const response = await fetch(`/api/order/${id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        // Update UI by changing the `paid` status for this order
        setTemp((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, paid: true } : order
          )
        );
      } else {
        console.error("Failed to update payment status.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };




  const handleInputChange = (id, value) => {
    setUpdatedNums((prev) => ({
      ...prev,
      [id]: value, // Store num for the specific order
    }));
  };

  const handleUpdate = async (id) => {
    const numToUpdate = updatedNums[id]; // Get the updated num for this order

    if (!numToUpdate) return; // Prevent empty values from being sent

    try {
      const response = await fetch(`/api/order1/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ num: numToUpdate }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Receipt number updated:", result);
      } else {
        console.error("Failed to update receipt number:", result);
      }
    } catch (error) {
      console.error("Error updating receipt number:", error);
    }
  };




  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(`/api/order/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Order deleted and stock restored");
        // Refresh orders after deletion
        window.location.replace("/reservation");;
      } else {
        console.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };


  return (
    <>
      <ExportButton allTemp={allTemp} />
      <table className="table table-striped container">
        <thead>
          <tr>
            <th scope="col">receipt #</th>
            <th scope="col">Client Name</th>
            <th scope="col">Total Amount</th>
            <th scope="col">Total items</th>
            <th scope="col">Code</th>
            <th scope="col">Date</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>

          {
            allTemp && allTemp?.length > 0 ? (
              allTemp.map((post: any, index: any) => (
                <tr>
                  <td>
                    <input
                      type="text"
                      value={updatedNums[post.id] || post.num || ""}
                      onChange={(e) => handleInputChange(post.id, e.target.value)}
                      placeholder="Enter receipt number"
                      className="border p-1"
                    />
                    <button
                      onClick={() => handleUpdate(post.id)}
                      className="bg-blue-500 text-white p-1 ml-2"
                    >
                      Submit
                    </button>
                  </td>
                  <td>{post.cartItems.fname}</td>
                  <td>${post.total}</td>
                  <td>
                    {post.userInfo?.length
                      ? post.userInfo.reduce(
                        (acc, item) => acc + (isNaN(item.quantity) ? 0 : Number(item.quantity)),
                        0
                      )
                      : "Loading..."}
                  </td>

                  <td>{post.code}</td>
                  <td>{post.date}</td>
                  <td>
                    <Link className="text-blue-700 mr-3 bg-black p-1" href={`/order?id=${post.id}`}>View</Link>
                    <td>
                      <button
                        onClick={() => handleDeleteOrder(post.id)}
                        className="bg-red-500 text-white p-1"
                      >
                        Delete
                      </button>
                    </td>
                    <button
                      className={`p-1 ${post.paid ? "bg-blue-500 text-white" : "bg-black text-white"}`}
                      onClick={() => !post.paid && handlePaymentUpdate(post.id)}
                      disabled={post.paid}
                    >
                      {post.paid ? "Paid" : "Unpaid"}
                    </button>

                  </td>
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