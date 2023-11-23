import React, { useEffect, useState } from "react";
import "../components/css/Cart.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

function Cart() {



  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const userId = userLogin ? userLogin.id : null;

  const navigate = useNavigate();


  // gọi giỏ hàng từ API theo từng user
  const [dataCart, setdataCart] = useState([]);
  const loadBook = async () => {
    if (userId) {
      const result = await axios.get(`http://localhost:8000/users/${userId}`);
      let productUser = result.data;
      setdataCart(productUser.cart);
    }
  };
  useEffect(() => {
    loadBook();
  }, []);





  // hàm xoá sản phẩm trong giỏ hàng giỏ hàng
  const deleteProduct = async (itemId) => {
    const updatedCart = dataCart.filter((item) => item.id !== itemId);

    setdataCart(updatedCart);
    await axios.patch(`http://localhost:8000/users/${userId}`, {
      cart: updatedCart,
    });
  };





  // Xây dựng hàm update tăng - giảm số lượng quantity

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      const editQuantity = dataCart.map((e) =>
        e.id === itemId ? { ...e, quantity: newQuantity } : e
      );
      setdataCart(editQuantity);
      await axios.patch(`http://localhost:8000/users/${userId}`, {
        cart: editQuantity,
      });
    }
  };



  // Hàm tính tổng tiền cần thanh toán
  let totalMoney = 0;
    
  for (let i = 0; i < dataCart.length; i++) {
      totalMoney +=  (dataCart[i].quantity) * (dataCart[i].price);
  }

  // hàm thanh toán
  const handleFinish = async() => {
    await axios.patch(`http://localhost:8000/users/${userId}`, {
      cart:[],
    });
    swal({
      icon: "success",
      title: "Thành công!",
    });
    navigate("/");
  }

  return (
    <div>
      <Header />
      <div className="product-table container">
        <h4>GIỎ HÀNG CỦA BẠN</h4>
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản Phẩm</th>
              <th>Tên sách</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Xoá</th>
            </tr>
          </thead>
          <tbody>
            {dataCart.map((element, index) => (
              <tr key={element.id}>
                <td>{index + 1}</td>
                <td>
                  <img src={element.src} alt="" />
                </td>
                <td>{element.name}</td>
                <td>{element.price}.000</td>
                <td>
                  <i
                    class="fa-solid fa-minus"
                    onClick={() =>
                      updateQuantity(element.id, element.quantity - 1)
                    }
                    disabled={element.quantity <= 1}
                  ></i>
                  <span>{element.quantity}</span>
                  <i
                    class="fa-solid fa-plus"
                    onClick={() =>
                      updateQuantity(element.id, element.quantity + 1)
                    }
                  ></i>
                </td>
                <td>{element.price * element.quantity}.000</td>
                <td>
                  <i
                    class="fa-solid fa-trash-can"
                    onClick={() => deleteProduct(element.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total_money">
          <h5>Tổng tiền: <span>{totalMoney}.000 đ</span></h5>
          <button onClick={handleFinish}>Thanh Toán</button>
        </div>
        <hr />
      </div>
      <Footer />
    </div>
  );
}

export default Cart;
