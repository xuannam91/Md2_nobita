import React, { useEffect, useState } from "react";
import "../css/Header.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";

import * as Yup from "yup";
import { toast } from "react-toastify";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Header() {
  const navigate = useNavigate();

  // hàm lấy giá trị ô input tim kiếm
  const [inputSearch, setInputSearch] = useState("");
  const [dataSearch, setDataSearch] = useState([]);



  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  



  // hàm thực thi tìm kiếm
  const handleSearchBook = async () => {
    if (inputSearch !== "") {
      try {
        let url = await axios.get(
          `http://localhost:8000/books?q=${inputSearch}`
        );
        let result = url.data;

        if (result.length > 0) {
          setDataSearch(result);
          setShow(true);
          setInputSearch("")
        } else {
          alert("Không tìm thấy kết quả");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  




  
  // gọi từ local người dùng về.
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const userId = userLogin ? userLogin.id : null;




  // hiển thị số sản phẩm đã mua của khách hàng
  const [dataCart, setdataCart] = useState([]);
  const loadBook = async () => {
    if (userId) {
      const result = await axios.get(`http://localhost:8000/users/${userId}`);
      let productUser = result.data;
      setdataCart(productUser.cart || []);
    }
  };
  useEffect(() => {
    loadBook();
  }, [dataCart]);

  const cartlength = dataCart.length;

  const handleLengthCart = () => {
    if(cartlength > 0){
      navigate("/cart")
    } 
  } 


  // logout
  const handleLogOut = () => {
    localStorage.removeItem("userLogin");
    navigate("/login");
  };



  // modal thay đổi thông tin người dùng
  const [modalUser, setModalUser] = useState(false);

  const handleShowModalUser = () => setModalUser(true);
  const handleCloseModalUser = () => setModalUser(false);

  const formik = useFormik({
    initialValues: {
      username: userLogin?.username,
      phonenumber: "",
      email: "",
      password: "",
      newpassword: "",
      address: "",
    },
    // b4: sử dụng Yup để viết các điều kiện cho input
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, "Nhập nhiều hơn 5 kí tự")
        .max(25, "Không vượt quá 25 kí tự")
        .required("Tên không được để trống"),
      phonenumber: Yup.string().required("Số điện thoại không được để trống"),
      email: Yup.string()
        .email("email chưa đúng định dạng")
        .required("Email không được để trống"),

      password: Yup.string()
        .min(8, "Nhập nhiều hơn 8 kí tự")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/,
          "Password phải chứa ít nhất một chữ hoa, số, kí tự đặc biệt và không có khoảng trắng "
        )
        .required("password không được để trống"),
      newpassword: Yup.string()
        .min(8, "Nhập nhiều hơn 8 kí tự")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/,
          "Password phải chứa ít nhất một chữ hoa, số, kí tự đặc biệt và không có khoảng trắng "
        )
        .required("newpassword không được để trống"),

      address: Yup.string().required("Địa chỉ không được để trống"),

    }),

    onSubmit: async (values) => {
      if (
        userLogin.password === values.password &&
        userLogin.email === values.email
      ) {
        const newUserChange = {
          id: userLogin.id,
          username: values.username,
          phonenumber: values.phonenumber,
          email: values.email,
          password: values.newpassword,
          address: values.address,
        };
        await axios.patch(
          `http://localhost:8000/users/${userLogin.id}`,
          newUserChange
        );
        toast.success("Đổi thông tin thành công");
        handleLogOut();
        navigate("/login");
      } else {
        alert("Email hoặc Mật khẩu cũ không chính xác");
      }
    },
  });

  return (
    <div>
      <div className="header">
        <nav className="container">
          <div className="container-fluid">
            <Link to={"/"}>
              <img
                src="https://nobita.vn/wp-content/uploads/2018/01/logo-22.png"
                alt=""
              />
            </Link>

            <div className="inputsearch">
              <form className="d-flex">
                <input
                  className="heading-input"
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                />
                <i
                  className="fa-solid fa-magnifying-glass"
                  onClick={handleSearchBook}
                />
              </form>
            </div>
            <div className="header-navbar">
              <>
                <span>
                  <i className="fa-regular fa-user icon_user"></i>
                </span>
                {userLogin === null ? (
                  <Link to={"/login"} className="link_login">ĐĂNG NHẬP</Link>
                ) : (
                  <span>
                    <span className="user_login" onClick={handleShowModalUser}>
                      {userLogin.username}
                    </span>
                    <button onClick={handleLogOut} className="logout_user">
                      Logout
                    </button>
                  </span>
                )}
              </>
            </div>

            <div>
                <i class="fa-solid fa-cart-shopping" onClick={handleLengthCart}>{cartlength > 0 ? <span>{cartlength}</span> : ""}</i>
            </div>
          </div>
        </nav>
      </div>

      {/* modal tìm kiếm xuất hiện tại đây */}
      <>
        <Modal show={show} onHide={handleClose} className="list_search">
      
              {dataSearch.map((element, index) => (
                <Link to={`/bookdetail/${element.id}`} className="link_search_modal">
                  <div key={element.id} className="article_search">
                    <div className="modal_search">
                      <img src={element.src} alt="" />
                    </div>
                    <div className="modal_search_infor">
                      <p className="search_infor_name">{element.name}</p>
                      <p className="search_infor_price">{element.price}.000 đ</p>
                    </div>
                    <hr />
                  </div>
                </Link>
              ))}

        </Modal>
      </>
      {/* kết thúc modal tìm kiếm  */}






      {/* modal thay đổi thông tin người dùng */}
      {modalUser && (
        <div className="overlay_user">
          <div className="modal-content_user">
            <Modal.Body className="modal_body_user">
              <Button
                className="btn_modal_user"
                variant="secondary"
                onClick={handleCloseModalUser}
              >
                X
              </Button>

              <div className="change_user">
                <h4>Thay Đổi Hồ Sơ</h4>
                <form
                  className="form_change_user"
                  onSubmit={formik.handleSubmit}
                >
                  <label className="change_user_label">Tên:</label>
                  <input
                    className="change_user_input"
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.username && formik.touched.username && (
                    <p className="change_user_error">
                      {formik.errors.username}
                    </p>
                  )}
                  <br />

                  <label className="change_user_label">Số điện thoại:</label>
                  <input
                    className="change_user_input"
                    type="text"
                    name="phonenumber"
                    value={formik.values.phonenumber}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.phonenumber && formik.touched.phonenumber && (
                    <p className="change_user_error">
                      {formik.errors.phonenumber}
                    </p>
                  )}
                  <br />

                  <label className="change_user_label">Email cũ:</label>
                  <input
                    className="change_user_input"
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="change_user_error">{formik.errors.email}</p>
                  )}
                  <br />

                  <label className="change_user_label">Mật khẩu cũ:</label>
                  <input
                    className="change_user_input"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.password && formik.touched.password && (
                    <p className="change_user_error">
                      {formik.errors.password}
                    </p>
                  )}
                  <br />
                  <label className="change_user_label">Mật khẩu mới:</label>
                  <input
                    className="change_user_input"
                    type="password"
                    name="newpassword"
                    value={formik.values.newpassword}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.newpassword && formik.touched.newpassword && (
                    <p className="change_user_error">
                      {formik.errors.newpassword}
                    </p>
                  )}
                  <br />

                  <label className="change_user_label">Địa chỉ:</label>
                  <input
                    className="change_user_input"
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.address && formik.touched.address && (
                    <p className="change_user_error">{formik.errors.address}</p>
                  )}
                  <br />

                  <div className="">
                    <button className="btn_change_user" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
