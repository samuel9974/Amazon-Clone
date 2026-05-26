import React, { useContext } from "react";

import { Link } from "react-router-dom";

import { DataContext } from "../../compenents/DataProvider/DataProvider.jsx";

import { Types } from "../../Utility/actionType.js";



const Cart = () => {

  const [state, dispatch] = useContext(DataContext);

  const { basket } = state;



  const subtotal = basket.reduce((sum, item) => sum + item.price, 0);



  const removeFromCart = (index) => {

    dispatch({ type: Types.REMOVE_FROM_BASKET, index });

  };



  return (

    <div className={classes.cart_container}>

      <h1>Shopping Cart</h1>



      {basket.length === 0 ? (

        <div className={classes.empty}>

          <p>Your Amazon Cart is empty.</p>

          <Link to="/">Continue Shopping</Link>

        </div>

      ) : (

        <div className={classes.cart_content}>

          <div className={classes.items}>

            {basket.map((item, index) => (

              <div key={`${item.id}-${index}`} className={classes.cart_item}>

                <img src={item.image} alt={item.title} />

                <div className={classes.item_info}>

                  <Link to={`/products/${item.id}`} className={classes.title}>

                    {item.title}

                  </Link>

                  <p className={classes.price}>${item.price.toFixed(2)}</p>

                  <button

                    type="button"

                    className={classes.remove}

                    onClick={() => removeFromCart(index)}

                  >

                    Remove

                  </button>

                </div>

              </div>

            ))}

          </div>



          <aside className={classes.summary}>

            <p>

              Subtotal ({basket.length}{" "}

              {basket.length === 1 ? "item" : "items"}):

            </p>

            <strong className={classes.subtotal}>

              ${subtotal.toFixed(2)}

            </strong>

            <Link to="/payment" className={classes.checkout}>

              Proceed to Checkout

            </Link>

          </aside>

        </div>

      )}

    </div>

  );

};



export default Cart;

