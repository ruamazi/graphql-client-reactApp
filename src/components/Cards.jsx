import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction";
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from "../graphql/queries/user";

const Cards = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);

  //relashionship, extractink users transactions from user in once request its like populate in mongoose
  const { data: authUser } = useQuery(GET_AUTHENTICATED_USER);
  // const { data: userAndTransactions } = useQuery(GET_USER_AND_TRANSACTIONS, {
  //   variables: { userId: authUser?.authUser?._id },
  // });

  if (error) {
    return <p> Error: {error.message} </p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {data.transactions.map((each) => (
          <Card
            key={each._id}
            transaction={each}
            authUser={authUser?.authUser}
          />
        ))}
      </div>
      {data.transactions.length < 1 && (
        <p className="text-2xl font-bold text-center w-full py-4">
          No transaction history
        </p>
      )}
    </div>
  );
};

export default Cards;
