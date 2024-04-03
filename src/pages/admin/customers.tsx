import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Column } from 'react-table';
import { SkeletonLoader } from '../../components/Loader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import TableHOC from '../../components/admin/TableHOC';
import {
  useAllUsersQuery,
  useDeleteUserMutation
} from '../../redux/api/userAPI';
import { RootState } from '../../redux/store';
import { CustomError } from '../../types/api-types';
import { responseToast } from '../../utils/features';

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: 'Avatar',
    accessor: 'avatar',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Gender',
    accessor: 'gender',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Role',
    accessor: 'role',
  },
  {
    Header: 'Action',
    accessor: 'action',
  },
];

const Customers = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [deleteUser] = useDeleteUserMutation();
  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({
      userId,
      adminUserId: user?._id!,
    });
    responseToast(res, null, '');
  };

  const { data, isLoading, isError, error } = useAllUsersQuery(user?._id!);

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          avatar: <img
          style={{
            borderRadius: "50%"
          }}
          alt={i.name}
           src={i.photo} />,
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: (
            <button onClick={() => deleteHandler(i._id)}>
              <FaTrash />
            </button>
          ),
        })),
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    'dashboard-product-box',
    'Customers',
    rows.length > 6,
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <SkeletonLoader length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
