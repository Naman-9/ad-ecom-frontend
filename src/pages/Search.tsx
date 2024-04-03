import React, { useState } from 'react';
import ProductCard from '../components/Product-Card';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/productApi';
import { CustomError } from '../types/api-types';
import toast from 'react-hot-toast';
import { SkeletonLoader } from '../components/Loader';
import { CartItem } from '../types/types';
import { addToCart } from '../redux/reducer/cartReducer';
import { useDispatch } from 'react-redux';

const Search = () => {

  const dispatch = useDispatch();

  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error: categoryError,
  } = useCategoriesQuery('');

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: searchData,
    isLoading: productsLoading,
    isError: isProductError,
    error: searchProductError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const isPrevPage = page > 1;
  const isNextPage = page < 4;


  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error('Out Of Stock.');

    dispatch(addToCart(cartItem));
    toast.success('Item added to Cart.');
  };

  if (isError || isProductError)  {
    const err = (isError ? categoryError : searchProductError ) as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>

        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ''}</h4>
          <input
            type="range"
            min={100}
            max={10000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          ></input>
        </div>

        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
            <option value="dsc">Sample 2</option>
          </select>
        </div>
      </aside>

      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {productsLoading ? (
          <SkeletonLoader width='5rem' length={10}/>
        ) : (
          <div className="search-product-list">
            {searchData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                photo={i.photo}
                stock={i.stock}
                handler={addToCartHandler}
              />
            ))}
          </div>
        )}

        {searchData && searchData.totalPage > 1 && (
          <article>
            <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>
              Prev
            </button>
            <span>
              {page} of {searchData.totalPage}
            </span>
            <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
