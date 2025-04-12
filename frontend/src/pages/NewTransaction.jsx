import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/layouts/AdminHeader";
import AdminSideBar from "../components/layouts/AdminSideBar";
import AdminFooter from "../components/layouts/AdminFooter";

export default function NewTransaction() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const navigate = useNavigate(); // Initialize router navigation

  useEffect(() => {
    const fetchMedicines = async () => {
      const medCollection = collection(db, "medicine_inventory");
      const snapshot = await getDocs(medCollection);
      const meds = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setMedicines(meds);
    };

    fetchMedicines();
  }, []);

  const handleAddToCart = (medicine) => {
    const existingItem = cart.find((item) => item.id === medicine.id);
    if (existingItem) {
      alert("Already in cart. You can adjust quantity from the cart.");
      return;
    }

    setCart([...cart, { ...medicine, quantity: 1 }]);
  };

  const handleQuantityChange = (id, qty) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: parseInt(qty) || 1 } : item
    );
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const handleTransaction = async () => {
    if (!customerName || cart.length === 0) {
      alert("Enter customer name and add at least one item.");
      return;
    }

    // ✅ Check for stock issues before proceeding
    const outOfStockItems = cart.filter((item) => item.quantity > item.stock);
    if (outOfStockItems.length > 0) {
      const itemNames = outOfStockItems
        .map((item) => `${item.name} (${item.power})`)
        .join(", ");
      alert(
        `Transaction failed. The following items exceed available stock: ${itemNames}`
      );
      return;
    }

    const transactionData = {
      customerName,
      items: cart,
      totalAmount: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      date: Timestamp.now(),
    };

    try {
      // Save the transaction and get the document reference
      const docRef = await addDoc(
        collection(db, "transactions"),
        transactionData
      );

      // Update stock levels
      for (let item of cart) {
        const medRef = doc(db, "medicine_inventory", item.id);
        const newStock = item.stock - item.quantity;
        await updateDoc(medRef, { stock: newStock });
      }

      // Clear form
      setCart([]);
      setCustomerName("");

      // Redirect to receipt
      navigate(`/receipt/${docRef.id}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("An error occurred while recording the transaction.");
    }
  };


  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content container-fluid">
          <h4 className="page-title">New Transaction</h4>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <h5>Select Medicines</h5>
          <div className="row">
            {medicines.map((med) => (
              <div className="col-md-4 mb-2" key={med.id}>
                <div className="card">
                  <div className="card-body">
                    <h6>
                      {med.name} <sup>{med.power}</sup>
                    </h6>
                    <p>Price: Ksh {med.price}</p>
                    <p>In stock: {med.stock}</p>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAddToCart(med)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <>
              <h5 className="mt-4">Cart</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.name} <sup>{item.power}</sup>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                        />
                      </td>
                      <td>Ksh {item.price * item.quantity}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2">
                      <strong>Total</strong>
                    </td>
                    <td colSpan="2">
                      <strong>
                        Ksh{" "}
                        {cart.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <button className="btn btn-success" onClick={handleTransaction}>
                Complete Transaction
              </button>
            </>
          )}
        </div>
        <AdminFooter />
      </div>
    </>
  );
}
