import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SkeletonLoader } from '../components/Loader';
import ProductCard from '../components/Product-Card';
import { useLatestProductsQuery } from '../redux/api/productApi';
import { addToCart } from '../redux/reducer/cartReducer';
import { CartItem } from '../types/types';

const Home = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useLatestProductsQuery('');

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error('Out Of Stock.');

    dispatch(addToCart(cartItem));
    toast.success('Item added to Cart.');
  };

  if (isError) toast.error('Cannot Fetch Products.');

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search">More</Link>
      </h1>

      <main>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              photo={i.photo}
              stock={i.stock}
              handler={addToCartHandler}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
