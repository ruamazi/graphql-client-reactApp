import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction";
import { useEffect, useState } from "react";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user";

ChartJS.register(ArcElement, Tooltip, Legend);
const DefchartData = {
  labels: [],
  datasets: [
    {
      label: "$",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
      borderRadius: 30,
      spacing: 10,
      cutout: 130,
    },
  ],
};
const Home = () => {
  const [chartData, setChartData] = useState(DefchartData);

  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });
  const { data, loading: statsLoading } = useQuery(GET_TRANSACTION_STATISTICS);
  const { data: userData, loading: authUserLoading } = useQuery(
    GET_AUTHENTICATED_USER
  );

  const handleLogout = async () => {
    toast.dismiss();
    try {
      await logout();
      client.resetStore();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (data?.categoryStatistics) {
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const totalAmount = data.categoryStatistics.map(
        (stat) => stat.totalAmount
      );
      const backgroundColor = [];
      const borderColor = [];

      categories.forEach((c) => {
        if (c === "saving") {
          backgroundColor.push("rgba(75, 192, 192)");
          borderColor.push("rgba(75, 192, 192)");
        } else if (c === "expense") {
          backgroundColor.push("rgba(255, 99, 132)");
          borderColor.push("rgba(255, 99, 132)");
        } else if (c === "investment") {
          backgroundColor.push("rgba(54, 162, 235)");
          borderColor.push("rgba(54, 162, 235)");
        }
      });

      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmount,
            backgroundColor,
            borderColor,
          },
        ],
      }));
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          {userData && (
            <img
              src={userData.authUser?.profilePicture}
              className="w-11 h-11 rounded-full border cursor-pointer"
              alt="Avatar"
            />
          )}

          {!loading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {loading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {data?.categoryStatistics?.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          )}

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};

export default Home;
