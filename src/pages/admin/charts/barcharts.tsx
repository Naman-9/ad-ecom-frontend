import { useSelector } from 'react-redux';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { BarChart } from '../../../components/admin/Charts';
import { RootState } from '../../../redux/store';
import { useBarQuery } from '../../../redux/api/dashboardApi';
import toast from 'react-hot-toast';
import { CustomError } from '../../../types/api-types';
import { SkeletonLoader } from '../../../components/Loader';
import { getLastMonths } from '../../../utils/features';


const {last12Month, last6Month} = getLastMonths();

const Barcharts = () => {

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useBarQuery(user?._id);
  if (isError) toast.error((error as CustomError).data.message);

  const products = data?.charts.products || [];
  const orders = data?.charts.orders || [];
  const users = data?.charts.users || [];

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>

        {isLoading ? (
          <SkeletonLoader length={20} />
        ) : (
          <>
            <section>
              <BarChart
                data_2={products}
                data_1={users}
                labels={last6Month}
                title_1="Products"
                title_2="Users"
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                data_1={orders}
                data_2={}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
                labels={last12Month}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Barcharts;
