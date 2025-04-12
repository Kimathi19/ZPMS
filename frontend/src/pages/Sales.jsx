import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AdminHeader from "../components/layouts/AdminHeader";
import AdminSideBar from "../components/layouts/AdminSideBar";
import AdminFooter from "../components/layouts/AdminFooter";

export default function DailySales() {
  const [salesByDate, setSalesByDate] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      const snapshot = await getDocs(collection(db, "transactions"));
      const sales = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const dateObj = data.date.toDate();
        const dateKey = dateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"

        if (!sales[dateKey]) {
          sales[dateKey] = 0;
        }

        sales[dateKey] += data.totalAmount;
      });

      setSalesByDate(sales);
    };

    fetchTransactions();
  }, []);

  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content container-fluid">
          <h4 className="page-title">Daily Sales Summary</h4>
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Sales (Ksh)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(salesByDate).map(([date, total]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>Ksh {total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminFooter />
      </div>
    </>
  );
}
