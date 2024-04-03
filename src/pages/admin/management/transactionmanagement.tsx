import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from '../../../redux/api/orderApi';
import { server } from '../../../redux/store';
import { CustomError } from '../../../types/api-types';
import { UserReducerInitialState } from '../../../types/reducer-types';
import { Order, OrderItem } from '../../../types/types';
import { SkeletonLoader } from '../../../components/Loader';
import { responseToast } from '../../../utils/features';

const orderItems: any[] = [];

const defaultData: Order = {
  shippingInfo: {
    address: '',
    city: '',
    country: '',
    state: '',
    pinCode: '',
  },
  subTotal: 0,
  shippingCharges: 0,
  tax: 0,
  discount: 0,
  total: 0,
  status: '',
  orderItems: [],
  user: {
    name: '',
    _id: '',
  },
  _id: '',
};

const TransactionManagement = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );

  const { data, isLoading, isError, error } = useOrderDetailsQuery(params.id!);

  const {
    shippingInfo: { address, city, state, country, pinCode },
    orderItems,
    user: { name },
    status,
    tax,
    subTotal,
    discount,
    total,
    shippingCharges,
    _id
  } = data?.order || defaultData;

  if (isError) {
    return <Navigate to={'/404'} />;
  }

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  
  const updateHandler = async()=> {
    
    const res = await updateOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async() => {
    
    const res = await deleteOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            <section
              style={{
                padding: '2rem',
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${server}/${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}</p>
              <h5>Amount Info</h5>
              <p>subTotal: {subTotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{' '}
                <span
                  className={
                    status === 'Delivered' ? 'purple' : status === 'Shipped' ? 'green' : 'red'
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({ name, photo, price, quantity, productId }: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
