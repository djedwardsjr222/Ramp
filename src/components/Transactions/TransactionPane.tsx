import { useState, useEffect } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved);

  // Update approved state when transaction.approved changes
  useEffect(() => {
    setApproved(transaction.approved);
  }, [transaction.approved]);

  const handleTransactionApprovalChange = async (newValue: boolean) => {
    // Update local state immediately
    setApproved(newValue);

    // Call the parent's setTransactionApproval to persist the change
    await consumerSetTransactionApproval({
      transactionId: transaction.id,
      newValue,
    });
  };

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={handleTransactionApprovalChange}
      />
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});