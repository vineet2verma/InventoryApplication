
// fetch payment type mast 
export const fetchPaymentTypeRecords = async () => {
  try {
    const res = await fetch("api/paymenttype");
    const data = await res.json();
    const paymenttypelist = Array.from(new Set(data.filter((item) => item.status == "Active").map((item) => item.payment)));
    return paymenttypelist
  } catch (err) {
    return console.error("Failed to fetch records:", err);
  }
};