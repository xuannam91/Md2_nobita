import React, { useEffect, useState } from "react";
import "../css/NewBook.css";
import axios from "axios";
import { Link } from "react-router-dom";

function ReleaseBook() {
  const [datas, setDatas] = useState([]);
  const loadBook = async () => {
    let url = `http://localhost:8000/books`;
    const result = await axios.get(url);
    setDatas(result.data);
  };
  useEffect(() => {
    loadBook();
  }, []);

  return (
    <div className="container">
      <div className="newbook_main">
        <div className="newbook_title">
          <p className="event_endow_detail">
            <div className="rectangle_detail"></div>
            <h4>Sắp Phát Hành</h4>
          </p>

          <Link to={"/list-release-book"} className="newbook_all">
            Xem tất cả <i className="fa-solid fa-angles-right" />
          </Link>
        </div>

        <div className="newbook-section">



          {datas
            .filter((element) => element.tagname === "releasebook")
            .slice(-5)
            .map((element, index) => (
              <div className="newbook_decoration" key={element.id}>
                <Link to={`/bookdetail/${element.id}`}>
                  <img src={element.src} alt="" />
                  <p className="newbook-name">{element.name}</p>
                  <p className="newbook-author">{element.author}</p>
                  <p className="newbook_price">
                    {element.price}.000<sup>đ</sup>
                  </p>
                </Link>
              </div>
            ))}



        </div>
      </div>
    </div>
  );
}

export default ReleaseBook;
