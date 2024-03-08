import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction";

const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
  // Add more categories and corresponding color classes as needed
};
const Card = ({ transaction, authUser }) => {
  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
  });

  const cat =
    transaction.category[0].toUpperCase() + transaction.category.slice(1);
  const pType =
    transaction.paymentType[0].toUpperCase() + transaction.paymentType.slice(1);
  const desc =
    transaction.description[0].toUpperCase() + transaction.description.slice(1);

  const loc =
    transaction.location &&
    transaction.location[0].toUpperCase() + transaction.location.slice(1);

  const cardClass = categoryColorMap[transaction.category];

  const handleDelete = async () => {
    toast.dismiss();
    try {
      await deleteTransaction({
        variables: { transactionId: transaction._id },
      });
      toast.success("Deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">{cat}</h2>
          <div className="flex items-center gap-2">
            <button
              className="hover:text-red-300"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-b-2 rounded-full animate-spin" />
              ) : (
                <FaTrash />
              )}
            </button>
            <Link to={`/transaction/${transaction._id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Description: {desc}
        </p>
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Payment Type: {pType}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Amount: {transaction.amount}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          Location: {loc || "N/A"}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-300 font-bold">
            {formatDate(transaction.date)}
          </p>
          <img
            src={authUser.profilePicture}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
