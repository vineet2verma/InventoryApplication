// Editable Quotation Page Matching PDF Design
"use client";
import { useState, useEffect, useRef } from "react";
import { LoginUserFunc } from "../context/loginuser";
import { House } from "lucide-react";
import { useRouter } from "next/navigation";


export default function QuotationPage() {
  const router = useRouter();
  const { user } = LoginUserFunc();
  // const converter = require('number-to-words');
  const [rightread, setrightread] = useState(false);
  const [rightcreate, setrightcreate] = useState(false);
  const [rightedit, setrightedit] = useState(false);
  const [rightdelete, setrightdelete] = useState(false);
  const [showCharges, setShowCharges] = useState(false);

  useEffect(() => {
    setrightread(user.user?.pquotation.includes("read") || false);
    setrightcreate(user.user?.pquotation.includes("create") || false);
    setrightedit(user.user?.pquotation.includes("update") || false);
    setrightdelete(user.user?.pquotation.includes("delete") || false);
  }, [user]);

  const [quotation, setQuotation] = useState({
    orderId: `Q-${new Date().toISOString().split("T")[0].replace(/-/g, "")}`, // Order ID in format Q-YYYYMMDD,
    date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    clientName: "Abc",
    companyName: "Abc Industries",
    saleperson: user.user?.name || "",
    billingAddress: "123 Billing Address, City",
    shippingAddress: "456 Shipping Address, City",
    gst: "29ABCDE1234F2Z5",
    items: [
      {
        description: "Tile A",
        size: "2x2",
        qtypersqft: 10,
        qtyperbox: 10,
        price: 20,
      },
    ],
    discount: 0,
    gstRate: 18,
    cuttingCharges: 0,
    cartageCharges: 0,
    packingCharges: 0,
  });

  const bankDetail = [
    { bank: "DEUTSCHE BANK" },
    { "a/c name": "ANTICA CERAMICA LLP" },
    { Account: "100040626900019" },
    { ifsc: "DEUT0784PBC" },
    { branch: "KASTURBA GANDHI MARG" },
  ];
  const termcondition = [
    "Payment 100% Advance",
    "Delivery After 10-15 Days After PO & payment",
    "Goods will not return once sold",
    "Disputes subject to Delhi jurisdiction only",
    "Unloading Charges Extra",
    "Transportation damage 3% will be accepted.",
  ];

  const handleItemChange = (index, field, value) => {
    const newItems = [...quotation.items];
    newItems[index][field] =
      field === "qtypersqft" || field === "qtyperbox" || field === "price"
        ? Number(value)
        : value;
    setQuotation({ ...quotation, items: newItems });
  };

  const addItem = () => {
    setQuotation({
      ...quotation,
      items: [
        ...quotation.items,
        { description: "", size: "", qtypersqft: 0, qtyperbox: 0, price: 0 },
      ],
    });
  };

  const deleteItem = (index) => {
    const items = quotation.items.filter((_, i) => i !== index);
    setQuotation({ ...quotation, items });
  };

  const printPage = () => {
    window.print();
  };

  const subtotal = quotation.items.reduce(
    (sum, item) => sum + item.qtyperbox * item.price,
    0
  );

  const discountAmt = (subtotal * quotation.discount) / 100;
  const afterDiscount = subtotal - discountAmt;
  const gstAmt = (afterDiscount * quotation.gstRate) / 100;
  const grandTotal =
    afterDiscount +
    gstAmt +
    Number(quotation.cuttingCharges || 0) +
    Number(quotation.cartageCharges || 0) +
    Number(quotation.packingCharges || 0);

  const handleSubmit = async () => {
    const method = "POST";
    const url = "/api/quotation";

    let res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotation),
    });

    let result = await res.json();
    if (result.success) {
      alert("Quotation Save Scussfully ");
    } else {
      console.log("failed to post record in quotation ", result);
    }
  };

  return (
    <>
      {rightread && (
        <div className="p-2 max-w-5xl mx-auto bg-white  rounded-xl mb-5 ">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center print:hidden gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <House className="w-5 h-5" />
              Home
            </button>

            <div className="text-center w-full">
              <h1 className="text-3xl font-bold">Antica Ceramica</h1>
              <p>40 Raja Garden, New Delhi 110015 | GSTIN: 07ABUFA8367K1ZL</p>
              <h2 className="text-xl font-semibold underline">Quotation</h2>
            </div>
            <div className="flex space-x-2 print:hidden">
              <button
                onClick={printPage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download
              </button>
              <button
                onClick={() => setShowCharges(true)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Charges
              </button>
            </div>
          </div>

          {/* Client , Ord ID & Date */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {/* Client Name */}
            <div>
              <label>Client Name</label>
              <input
                type="text"
                className=" border w-full px-2 py-1"
                value={quotation.clientName}
                onChange={(e) =>
                  setQuotation({ ...quotation, clientName: e.target.value })
                }
              />
            </div>
            {/* Order ID  & Date  */}
            <div className="grid grid-cols-2 gap-2 ">
              <div className="">
                <label>Order ID</label>
                <input
                  type="text"
                  className=" border w-full px-2 py-1"
                  value={quotation.orderId}
                  onChange={(e) =>
                    setQuotation({ ...quotation, orderId: e.target.value })
                  }
                />
              </div>
              {/* Date */}
              <div className="">
                <label>Date</label>
                <input
                  type="date"
                  className=" border w-full px-2 py-1"
                  value={quotation.date}
                  onChange={(e) =>
                    setQuotation({ ...quotation, date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Company & GST */}
          <div className="grid grid-cols-2 gap-2">
            {/* Company Name */}
            <div>
              <label>Company Name</label>
              <input
                type="text"
                className=" border w-full px-2 py-0.5"
                value={quotation.companyName}
                onChange={(e) =>
                  setQuotation({ ...quotation, companyName: e.target.value })
                }
              />
            </div>
            {/* GST */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>GSTIN</label>
                <input
                  type="text"
                  className=" text-sm border w-full px-2 py-1"
                  value={quotation.gst}
                  onChange={(e) =>
                    setQuotation({ ...quotation, gst: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Sale Person</label>
                <input
                  type="text"
                  className=" text-sm border w-full px-2 py-1"
                  value={quotation.saleperson}
                  onChange={(e) =>
                    setQuotation({ ...quotation, saleperson: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div>
              <label>Billing Address</label>
              <textarea
                className="text-sm border resize-none w-full px-2 py-2"
                rows={3}
                value={quotation.billingAddress}
                onChange={(e) =>
                  setQuotation({ ...quotation, billingAddress: e.target.value })
                }
              />
            </div>
            <div>
              <label>Shipping Address</label>
              <textarea
                className="text-sm border resize-none  w-full px-2 py-2"
                rows={3}
                value={quotation.shippingAddress}
                onChange={(e) =>
                  setQuotation({
                    ...quotation,
                    shippingAddress: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">S.No</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Size</th>
                <th className="border px-2 py-1">Qty/Sqft</th>
                <th className="border px-2 py-1">Qty/Box</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1 print:hidden">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1 text-center">{index + 1}</td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full  px-1 "
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1 max-w-20 ">
                    <input
                      className="w-full  px-1 text-center "
                      value={item.size}
                      onChange={(e) =>
                        handleItemChange(index, "size", e.target.value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1 max-w-15">
                    <input
                      type="number"
                      className="w-full  px-1 text-center"
                      value={item.qtypersqft}
                      onChange={(e) =>
                        handleItemChange(index, "qtypersqft", e.target.value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1 max-w-15">
                    <input
                      type="number"
                      className="w-full  px-1 text-center"
                      value={item.qtyperbox}
                      onChange={(e) =>
                        handleItemChange(index, "qtyperbox", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-2 py-1 max-w-20">
                    <input
                      type="number"
                      className="w-full px-1 text-center"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1  text-right">
                    ₹{(item.qtyperbox * item.price).toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 text-center max-w-2  print:hidden ">
                    <button
                      className="text-red-500 "
                      onClick={() => deleteItem(index)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addItem}
            className="mt-2 px-4 py-1 border rounded print:hidden hover:bg-gray-100"
          >
            + Add Item
          </button>

          <div className="mt-4 flex justify-between">
            {/* Bank Detail Left Side */}

            <div className="text-left p-2  rounded-2xl ">
              <img
                src="/bank-bar-code.jpg"
                alt="Bank QR Code"
                width="100"
                height="100"
                className="float-right border-black ml-5 mt-4.5"
              />

              <table className="mt-2">
                <thead>
                  <tr>
                    <th
                      colSpan={2}
                      className="text-left text-sm underline pb-1"
                    >
                      Bank Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bankDetail.map((record, index) => {
                    const key = Object.keys(record)[0];
                    const value = record[key];
                    return (
                      <tr key={index}>
                        <td className="pr-3 text-xs font-medium">
                          {key.toUpperCase()} :
                        </td>
                        <td className="pr-3 text-xs">{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Subtotal Right Side */}
            <div className=" text-sm text-right">
              <div>Subtotal: ₹ {subtotal.toFixed(2)}</div>
              {quotation.discount > 0 && (
                <div>
                  Discount ({quotation.discount}%): -₹{discountAmt.toFixed(2)}
                </div>
              )}
              {quotation.gstRate > 0 && (
                <div>
                  GST ({quotation.gstRate}%): ₹{gstAmt.toFixed(2)}
                </div>
              )}
              {quotation.cuttingCharges > 0 && (
                <div>Cutting Charges: ₹{quotation.cuttingCharges}</div>
              )}
              {quotation.cartageCharges > 0 && (
                <div>Cartage Charges: ₹{quotation.cartageCharges}</div>
              )}
              {quotation.packingCharges > 0 && (
                <div>Packing Charges: ₹{quotation.packingCharges}</div>
              )}
              <div className="text-lg font-bold">
                Grand Total: ₹{grandTotal.toFixed(2)}
              </div>
              <div className="text-lg font-bold">
                {/* <p>{"Amount :- "}{converter.toWords(grandTotal.toFixed(2))}</p> */}
              </div>
            </div>
          </div>

          <div className="my-2">
            <table>
              <thead>
                <tr>
                  <th className="text-left underline">Term Condition</th>
                </tr>
              </thead>
              <tbody>
                {termcondition.map((field, i) => (
                  <tr key={i}>
                    <td className="text-xs py-0.2 pl-3 flex">
                      {"* "}
                      {field}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="print:hidden mb-5 text-right">
            <button
              className="bg-green-500 rounded-2xl py-2 px-10 mr-2 w-60 hover:bg-green-600 text-black"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

          {showCharges && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h3 className="text-lg font-semibold mb-4">Enter Charges</h3>
                <div className="space-y-3">
                  <div>
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      className="border w-full px-2 py-1 "
                      value={quotation.discount}
                      onChange={(e) =>
                        setQuotation({ ...quotation, discount: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>GST Rate (%)</label>
                    <input
                      type="number"
                      className="border w-full px-2 py-1"
                      value={quotation.gstRate}
                      onChange={(e) =>
                        setQuotation({ ...quotation, gstRate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Cutting Charges</label>
                    <input
                      type="number"
                      className="border w-full px-2 py-1"
                      value={quotation.cuttingCharges}
                      onChange={(e) =>
                        setQuotation({
                          ...quotation,
                          cuttingCharges: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Cartage Charges</label>
                    <input
                      type="number"
                      className="border w-full px-2 py-1"
                      value={quotation.cartageCharges}
                      onChange={(e) =>
                        setQuotation({
                          ...quotation,
                          cartageCharges: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Packing Charges</label>
                    <input
                      type="number"
                      className="border w-full px-2 py-1"
                      value={quotation.packingCharges}
                      onChange={(e) =>
                        setQuotation({
                          ...quotation,
                          packingCharges: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="text-right mt-4">
                  <button
                    onClick={() => setShowCharges(false)}
                    className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
