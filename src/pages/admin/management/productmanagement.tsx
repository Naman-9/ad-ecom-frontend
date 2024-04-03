import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { useSelector } from 'react-redux';
import { UserReducerInitialState } from '../../../types/reducer-types';
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from '../../../redux/api/productApi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SkeletonLoader } from '../../../components/Loader';
import { responseToast } from '../../../utils/features';
import { server } from '../../../redux/store';

const img =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804';

const Productmanagement = () => {

  const params = useParams();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state: { useReducer: UserReducerInitialState }) => state.userReducer,
  );

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const { _id, price, stock, name, photo, category } = data?.product || {
    _id: '',
    name: '',
    photo: '',
    category: '',
    price: 0,
    stock: 0,
  };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if(nameUpdate) formData.set("name", nameUpdate);
    if(priceUpdate) formData.set("price", priceUpdate.toString());
    if(stockUpdate !== undefined ) formData.set("stock", stockUpdate.toString());
    if(photoFile) formData.set("photo", photoFile);
    if(categoryUpdate) formData.set("category", categoryUpdate);

    const res = await updateProduct({
      formData, 
      userId: user?._id!, 
      productId: data?.product._id! 
    });

    responseToast(res, navigate, "/admin/product");
    

  };
  const deleteHandler = async() => {

    const res = await deleteProduct({
      userId: user?._id!, 
      productId: data?.product._id! 
    });

    responseToast(res, navigate, "/admin/product");
    

  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPhotoUpdate(data.product.photo);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
    }
  }, [data]);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  if (isError) {
    return <Navigate to={"/404"} />
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <SkeletonLoader length={15}/>
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={`${server}/${photo}`} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
