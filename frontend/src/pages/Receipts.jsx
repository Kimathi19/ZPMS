import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ReceiptComponent() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        console.error("Transaction ID is undefined");
        return;
      }

      try {
        const docRef = doc(db, "transactions", transactionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTransaction(docSnap.data());
        } else {
          console.error("No transaction found!");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  if (!transaction) return <p>Loading receipt...</p>;

  return (
    <div className="container mt-5">
      <h2>Receipt</h2>
      <p>Customer: {transaction.customerName}</p>
      <p>Date: {transaction.date.toDate().toLocaleString()}</p>
      <table className="table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.map((item, index) => (
            <tr key={index}>
              <td>
                {item.name} <sup>{item.power}</sup>
              </td>
              <td>{item.quantity}</td>
              <td>Ksh {item.price}</td>
              <td>Ksh {item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Total: Ksh {transaction.totalAmount}</h4>
      <button className="btn btn-primary mt-3" onClick={() => window.print()}>
        Print Receipt
      </button>
    </div>
  );
}
