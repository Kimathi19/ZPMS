import React, { useState, useEffect } from "react";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";

export default function Inventory() {
  var counter = 1;
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [filterOption, setFilterOption] = useState("all");

  const medicinesCollectionRef = collection(db, "medicine_inventory");

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expDate = new Date(expiryDate);
    const differenceInDays = Math.ceil(
      (expDate - today) / (1000 * 60 * 60 * 24)
    );
    return differenceInDays <= 25;
  };

  const isLowStock = (stock) => stock < 20;

  const applyFilters = (allMeds) => {
    switch (filterOption) {
      case "lowStock":
        return allMeds.filter((med) => isLowStock(med.stock));
      case "expiringSoon":
        return allMeds.filter((med) => isExpiringSoon(med.expiry_date));
      default:
        return allMeds;
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(medicinesCollectionRef, (snapshot) => {
      const fetchedMedicines = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedicines(fetchedMedicines);
      setFilteredMedicines(applyFilters(fetchedMedicines));
    });

    return () => unsubscribe();
  }, [filterOption]);

  const handleDeleteButton = async (id) => {
    const medDoc = doc(medicinesCollectionRef, id);
    await deleteDoc(medDoc);
  };

  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Medicine Inventory</h4>

            {/* Filter Dropdown */}
            <div className="row mb-3 px-3">
              <div className="col-md-6">
                <select
                  className="form-control"
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <option value="all">Show All Medicines</option>
                  <option value="lowStock">Low Stock (&lt; 20)</option>
                  <option value="expiringSoon">
                    Expiring Soon (&lt; 25 days)
                  </option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card card-tasks">
                  <div className="card-header">
                    <h4 className="card-title">
                      Inventory List{" "}
                      <Link
                        to="/addmedicine"
                        className="btn btn-primary btn-sm float-right"
                      >
                        Add new Medicine
                      </Link>
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="table-full-width px-5 py-4 table-striped">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>
                              Medicine Name<sup>Power</sup>
                            </th>
                            <th>Medicine Category</th>
                            <th>Medicine Type</th>
                            <th>Medicine Price</th>
                            <th>Stock</th>
                            <th>Expiry Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMedicines.map((medicine) => {
                            const lowStock = isLowStock(medicine.stock);
                            const expiring = isExpiringSoon(
                              medicine.expiry_date
                            );
                            const rowClass =
                              lowStock || expiring ? "table-danger" : "";

                            return (
                              <tr key={medicine.id} className={rowClass}>
                                <td>{counter++}</td>
                                <td>
                                  {medicine.name} <sup>{medicine.power}</sup>
                                </td>
                                <td>{medicine.category}</td>
                                <td>{medicine.type}</td>
                                <td>Ksh. {medicine.price}</td>
                                <td>
                                  {medicine.stock}
                                  {lowStock && (
                                    <span className="badge badge-danger ml-2">
                                      Low
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {medicine.expiry_date}
                                  {expiring && (
                                    <span className="badge badge-warning ml-2">
                                      Expiring Soon
                                    </span>
                                  )}
                                </td>
                                <td className="td-actions">
                                  <div className="form-button-action">
                                    <Link to="/updatemedicine">
                                      <button
                                        type="button"
                                        className="btn btn-link btn-success"
                                        onClick={() => {
                                          localStorage.setItem(
                                            "medicine_obj",
                                            JSON.stringify(medicine)
                                          );
                                        }}
                                      >
                                        <i className="la la-edit"></i>
                                      </button>
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteButton(medicine.id)
                                      }
                                      className="btn btn-link btn-danger"
                                    >
                                      <i className="la la-times"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredMedicines.length === 0 && (
                            <tr>
                              <td
                                colSpan="8"
                                className="text-center text-muted"
                              >
                                No medicines match the selected filter.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    </>
  );
}
