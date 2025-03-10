import React from "react";

export default function AdminFooter() {
  return (
    <>
      <footer className="footer">
        <div className="container-fluid">
          Zin Pharmacy
          <div className="copyright ml-auto">
            {" "}
            Copyright &copy;&nbsp;
            {new Date().getFullYear()}, made with <i className="la la-heart heart text-danger"></i>{" "}
            by{" "}
            <a href="https://github.com/Kimathi19" target={"_blank"}>
             Kimathi
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
