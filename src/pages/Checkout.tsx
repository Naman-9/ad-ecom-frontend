import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { NewOrderRequest } from '../types/api-types';
import { useDispatch, useSelector } from 'react-redux';
import { CartReducerInitialState, UserReducerInitialState } from '../types/reducer-types';
import { useNewOrderMutation } from '../redux/api/orderApi';
import { resetCart } from '../redux/reducer/cartReducer';
import { responseToast } from '../utils/features';
import { RootState } from '../redux/store';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { cartItems, total, discount, shippingCharges, shippingInfo, subTotal, tax } = useSelector(
    (state: RootState) => state.cartReducer,
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subTotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id!,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements, // reads all data from "PaymentElement"
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required',
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || 'Something Went Wrong.');
    }

    if (paymentIntent.status === 'succeeded') {
      console.log('Placing Order');
      const res = await newOrder(orderData);
      dispatch(resetCart());
      responseToast(res, navigate, '/orders');
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing' : 'Pay'}
        </button>
      </form>
    </div>
  );
};

const checkout = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={'/shipping'} />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default checkout;
