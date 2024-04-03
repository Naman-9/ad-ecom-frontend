import { FaCartPlus } from 'react-icons/fa6';
import { server } from '../redux/store';
import { CartItem } from '../types/types';

// think what's needed to make the UI
type ProductsProp = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({ productId, name, photo, price, stock, handler }: ProductsProp) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>{price}</span>

      <div>
        <button onClick={() => handler({ productId, photo, name, price, quantity: 1, stock })}>
          <FaCartPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
