import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { VscError } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItemCard from '../components/CartItem';
import {
  addToCart,
  applyDiscount,
  calculatePrice,
  removeCartItem,
} from '../redux/reducer/cartReducer';
import { CartReducerInitialState } from '../types/reducer-types';
import { CartItem } from '../types/types';
import axios from 'axios';
import { server } from '../redux/store';

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, total, subTotal, tax, shippingCharges, discount } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
  );

  const [couponCode, setCouponCode] = useState<string>('');
  const [isCouponValid, setIsCouponValid] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return toast.error('Out of stock');

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) {
      removeHandler(cartItem.productId);
      return;
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    // to cancel request as another new request
    // token, function(cancel) to cancel (abort Controller)
    const { token, cancel } = axios.CancelToken.source();

    const id = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, { cancelToken: token })
        .then((res) => {
          dispatch(applyDiscount(res.data.discount));
          dispatch(calculatePrice());

          setIsCouponValid(true);
        })
        .catch((err) => {
          dispatch(applyDiscount(0));
          dispatch(calculatePrice());

          setIsCouponValid(false);
        });

      return () => {
        clearTimeout(id);
        cancel();
        setIsCouponValid(false);
      };
    }, 1000);
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, idx) => (
            <CartItemCard
              key={idx}
              cartItem={item}
              decrementHandler={decrementHandler}
              incrementHandler={incrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>
            No items in cart. <Link to="home">Shop Now</Link>
          </h1>
        )}
      </main>

      {cartItems.length && (
        <aside>
          <p>SubTotal: ${subTotal}</p>
          <p>Shipping Charges: ${shippingCharges}</p>
          <p>Tax: ${tax}</p>
          <p>
            Discount: <em className="red">- ${discount}</em>
          </p>

          <p>
            <p>Total: ${total}</p>
          </p>

          <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
          <label htmlFor=""> Coupon Code</label>
          {couponCode &&
            (isCouponValid ? (
              <span className="green">
                ${discount} off using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                Invalid Coupon Code <VscError />
              </span>
            ))}

          <Link to="/shipping">Checkout</Link>
        </aside>
      )}
    </div>
  );
};

export default Cart;
