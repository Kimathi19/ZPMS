import React from "react";

export default function AdminFooter() {
  return (
    <>
      <footer className="footer">
        <div className="container-fluid">
          Pharmacy Management System
          <div className="copyright ml-auto">
            {" "}
            Copyright &copy;&nbsp;
            {new Date().getFullYear()}, made with 🤎 by{" "}
            <a
              className="text-decoration-none text-dark"
              href="https://briankimathi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kimathi
            </a>{" "}
            and{" "}
            <a
              className="text-decoration-none text-dark"
              href="https://mogire.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mogire
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
