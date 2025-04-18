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
            {new Date().getFullYear()}, made with 🤎 by{" "}
            <a
              className="text-decoration-none text-dark"
              href="https://github.com/MOGIRE11"
              target="_blank"
              rel="noopener noreferrer"
            >
              Thee_mmo
            </a>{" "}
            and{" "}
            <a
              className="text-decoration-none text-dark"
              href="https://github.com/Kimathi19"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kimathi
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
