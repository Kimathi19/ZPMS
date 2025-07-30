import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AdminHeader from "../components/layouts/AdminHeader";
import AdminSideBar from "../components/layouts/AdminSideBar";
import AdminFooter from "../components/layouts/AdminFooter";

export default function SalesReports() {
  const [salesByDate, setSalesByDate] = useState({});
  const [salesByMonth, setSalesByMonth] = useState({});
  const [categorySales, setCategorySales] = useState({});
  const [productSales, setProductSales] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      const snapshot = await getDocs(collection(db, "transactions"));
      const daily = {};
      const monthly = {};
      const category = {};
      const product = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const dateObj = data.date.toDate();

        const dateKey = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
        const monthKey = `${dateObj.getFullYear()}-${String(
          dateObj.getMonth() + 1
        ).padStart(2, "0")}`; // YYYY-MM

        // Daily Sales
        if (!daily[dateKey]) daily[dateKey] = 0;
        daily[dateKey] += data.totalAmount;

        // Monthly Sales
        if (!monthly[monthKey]) monthly[monthKey] = 0;
        monthly[monthKey] += data.totalAmount;

        // Category & Product Sales
        data.items.forEach((item) => {
          // Category
          if (!category[item.category]) category[item.category] = 0;
          category[item.category] += item.quantity;

          // Product
          if (!product[item.name]) product[item.name] = 0;
          product[item.name] += item.quantity;
        });
      });

      setSalesByDate(daily);
      setSalesByMonth(monthly);
      setCategorySales(category);
      setProductSales(product);
    };

    fetchTransactions();
  }, []);

  // Helpers to sort
  const sortedDates = Object.entries(salesByDate).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );
  const sortedMonths = Object.entries(salesByMonth).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );
  const sortedCategories = Object.entries(categorySales).sort(
    (a, b) => b[1] - a[1]
  );
  const sortedTopProducts = Object.entries(productSales).sort(
    (a, b) => b[1] - a[1]
  );
  const sortedLeastProducts = Object.entries(productSales).sort(
    (a, b) => a[1] - b[1]
  );

  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content container-fluid">
          {/* Daily Sales */}
          <h4 className="page-title" style={{ color: "#1E90FF" }}>
            Daily Sales Summary
          </h4>
          <table className="table table-striped mt-3">
            <thead style={{ backgroundColor: "#40E0D0", color: "white" }}>
              <tr>
                <th>Date</th>
                <th>Total Sales (Ksh)</th>
              </tr>
            </thead>
            <tbody>
              {sortedDates.map(([date, total]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>Ksh {total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Monthly Sales */}
          <h4 className="page-title mt-5" style={{ color: "#1E90FF" }}>
            Monthly Sales Summary
          </h4>
          <table className="table table-striped mt-3">
            <thead style={{ backgroundColor: "#40E0D0", color: "white" }}>
              <tr>
                <th>Month</th>
                <th>Total Sales (Ksh)</th>
              </tr>
            </thead>
            <tbody>
              {sortedMonths.map(([month, total]) => (
                <tr key={month}>
                  <td>{month}</td>
                  <td>Ksh {total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Category-wise Sales */}
          <h4 className="page-title mt-5" style={{ color: "#1E90FF" }}>
            Category-Wise Sales Report
          </h4>
          <table className="table table-striped mt-3">
            <thead style={{ backgroundColor: "#40E0D0", color: "white" }}>
              <tr>
                <th>Category</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.map(([category, quantity]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Top-Selling Products */}
          <h4 className="page-title mt-5" style={{ color: "#1E90FF" }}>
            Top-Selling Products
          </h4>
          <table className="table table-striped mt-3">
            <thead style={{ backgroundColor: "#40E0D0", color: "white" }}>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {sortedTopProducts.map(([product, quantity]) => (
                <tr key={product}>
                  <td>{product}</td>
                  <td>{quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Least-Selling Products */}
          <h4 className="page-title mt-5" style={{ color: "#1E90FF" }}>
            Least-Selling Products
          </h4>
          <table className="table table-striped mt-3 mb-5">
            <thead style={{ backgroundColor: "#40E0D0", color: "white" }}>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeastProducts.map(([product, quantity]) => (
                <tr key={product}>
                  <td>{product}</td>
                  <td>{quantity}</td>
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
