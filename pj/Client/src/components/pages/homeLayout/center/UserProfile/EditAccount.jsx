import { NavLink, useLocation } from "react-router-dom";
import "./EditAccount.css";
import Savebtn from "../../../../utills/buttons/Savebtn";
import Closebtn from "../../../../utills/buttons/Closebtn";
import { useState, useEffect } from "react";
import api from "../../../../../components/auth/api";
import Swal from "sweetalert2";

function EditAccount() {
  return (
    <>
      <header>
        <NavLink to="/">
          <Closebtn />
        </NavLink>
        <div>계정관리</div>
      </header>
      <main>
        <form action="">
          <div className="accountContainer">
            <div>
              <label htmlFor="pw">비밀번호 변경 : </label>
              <input type="password" id="pw" />
            </div>
            <div>
              <label htmlFor="pn">연락처 변경 : </label>
              <input type="text" id="pn" />
            </div>
            <div>
              <label htmlFor="">로그인 기록 조회</label>
            </div>
          </div>

          <div className="save">
            <Savebtn btnText="저장" className="save" />
          </div>
        </form>
      </main>
    </>
  );
}
export default EditAccount;
