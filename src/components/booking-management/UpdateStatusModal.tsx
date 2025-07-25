"use client";

import React, { useEffect, useRef, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import { useCheckout } from "@/app/context/CheckoutContext";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  checkoutId: string;
  serviceCustomerId: string;
  serviceManId?: string;
  serviceId?: string;
  amount: string;
  loading: boolean;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  checkoutId,
  serviceCustomerId,
  serviceManId,
  serviceId,
  amount,
  loading,
}) => {
  const [statusType, setStatusType] = useState("");
  const [description, setDescription] = useState("");
  const [linkType, setLinkType] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [generatingPaymentLink, setGeneratingPaymentLink] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [isCashInHand, setIsCashInHand] = useState(false);
  // Create a ref array to manage input focus
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);


  const { fetchCheckoutsDetailsById, checkoutDetails } = useCheckout();
  console.log(linkType);

  useEffect(() => {
    if (checkoutId && !checkoutDetails?._id) {
      fetchCheckoutsDetailsById(checkoutId);
    }
  }, [checkoutId, checkoutDetails?._id, fetchCheckoutsDetailsById]);

  useEffect(() => {
    if (
      statusType === "Payment request (partial/full)" &&
      isCashInHand &&
      checkoutDetails?.paymentStatus !== "paid"
    ) {

      setStatusType("Lead completed");
      setPaymentLink("");
      setDescription("Cash in hand collected by provider from customer");
      setIsOtpModalOpen(true);
    }
  }, [statusType, isCashInHand, checkoutDetails?.paymentStatus]);


  const handleDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!statusType) {
      alert("Please select a status type.");
      return;
    }

    const formData = new FormData();
    formData.append("checkout", checkoutId);
    formData.append("serviceCustomer", serviceCustomerId);
    formData.append("serviceMan", serviceManId ?? "null");
    formData.append("service", serviceId ?? "");
    formData.append("amount", amount);

    const leadStatus: Record<string, unknown> = {
      statusType,
      description,
    };

    leadStatus.zoomLink = zoomLink;

    if (paymentLink.trim()) leadStatus.paymentLink = paymentLink;
    if (paymentType) leadStatus.paymentType = paymentType;

    formData.append("leads", JSON.stringify([leadStatus]));

    if (document) {
      formData.append("document", document);
    }

    onSubmit(formData);
    setStatusType("");
    setDescription("");
    setLinkType("");
    setZoomLink("");
    setPaymentLink("");
    setPaymentType("");
    setDocument(null);
  };

  const createPaymentLink = async (amountToPay: number) => {
    setGeneratingPaymentLink(true);
    try {
      const res = await fetch(
        "https://biz-booster.vercel.app/api/payment/generate-payment-link",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountToPay,
            customerId: serviceCustomerId,
            customerName: "Customer Name",
            customerEmail: "customer@example.com",
            customerPhone: "9999999999",
          }),
        }
      );

      const data = await res.json();
      setPaymentLink(data.paymentLink || "");
    } catch (error) {
      console.error("Payment link generation failed", error);
      alert("Failed to generate payment link.");
    } finally {
      setGeneratingPaymentLink(false);
    }
  };

  const handleOtpVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");
    setOtpSuccess(false);

    try {
      const res = await fetch(
        "https://biz-booster.vercel.app/api/provider/lead/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutId, otp: enteredOtp }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setOtpSuccess(true);

        if (isCashInHand) {
          try {
            const cashRes = await fetch(
              `https://biz-booster.vercel.app/api/checkout/cash-in-hand/${checkoutId}`,
              {
                method: "PUT",
              }
            );
            const cashData = await cashRes.json();
            if (!cashData.success) {
              console.error("Cash-in-hand update failed:", cashData.message);
              alert("Warning: Cash-in-hand status not saved.");
            }
          } catch (cashError) {
            console.error("Cash-in-hand API error:", cashError);
            alert("Warning: Could not mark cash-in-hand on server.");
          }
        }

        setTimeout(() => {
          setIsOtpModalOpen(false);
          handleSubmit();
        }, 1000);
      } else {
        setOtpError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error); // or log to external service
      setOtpError("Something went wrong. Please try again.");
    }
    finally {
      setVerifyingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Update Status
        </h2>

        <div className="mb-4">
          <Label className="block mb-1 font-medium">Status Type</Label>
          <select
            className="w-full p-2 rounded-md border"
            value={statusType}
            onChange={(e) => {
              const selected = e.target.value;

              if (selected === "Lead completed") {
                if (
                  checkoutDetails &&
                  checkoutDetails.paymentStatus == "paid") {
                  setStatusType(selected);
                  setIsOtpModalOpen(true);
                }
                else {
                  alert(
                    "Payment is not completed. Please complete payment before marking as completed."
                  );
                  setStatusType("Payment request (partial/full)");


                  if (
                    checkoutDetails?.paymentStatus !== "paid"
                  ) {
                    setPaymentType("remaining");
                    createPaymentLink(
                      Number(checkoutDetails?.remainingAmount || 0)
                    );
                  } else {
                    setPaymentType("full");
                    createPaymentLink(Number(amount));
                  }
                }
              } else {
                setStatusType(selected);
              }
            }}
          >
            <option value="">Select</option>
            <option value="Lead request">Lead request</option>
            <option value="Initial contact">Initial contact</option>
            <option value="Need understand requirement">Need understand requirement</option>
            <option value="Payment request (partial/full)">Payment request (partial/full)</option>
            <option value="Payment verified">Payment verified</option>
            <option value="Lead accepted">Lead accepted</option>
            <option value="Lead requested documents">Lead requested documents</option>
            <option value="Lead started">Lead started</option>
            <option value="Lead ongoing">Lead ongoing</option>
            <option value="Lead completed">Lead completed</option>
            <option value="Lead cancel">Lead cancel</option>
            <option value="Refund">Refund</option>
          </select>
        </div>

        <div className="mb-4">
          <Label className="block mb-1 font-medium">Description</Label>
          <textarea
            rows={2}
            className="w-full p-2 rounded-md border"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description here..."
          />
        </div>

        <div className="mb-4">
          {(statusType === "Payment request (partial/full)" ||
            statusType === "Need understand requirement") && (
              <Label className="block mb-1 font-medium">Add Link</Label>
            )}

          {statusType === "Need understand requirement" && (
            <input
              type="text"
              placeholder="Enter Zoom Link"
              className="w-full p-2 rounded-md border"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
            />
          )}

          {statusType === "Payment request (partial/full)" && (
            <>
              {paymentType === "remaining" || paymentType === "full" ? (
                <div className="my-3">
                  <Label className="block mb-1 font-medium">
                    {paymentType === "remaining"
                      ? "Remaining Payment Amount"
                      : "Full Payment Amount"}
                  </Label>
                  <Label className="text-red-700 block">
                    ₹{" "}
                    {(paymentType === "remaining"
                      ? checkoutDetails?.remainingAmount ?? 0
                      : amount ?? 0).toString()}
                  </Label>

                </div>
              ) : (
                <div className="flex gap-4 my-3">
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={paymentType === "full"}
                      onChange={() => {
                        setPaymentType("full");
                        createPaymentLink(Number(amount));
                      }}
                    />
                    Full Payment
                  </Label>
                  <Label className="text-red-700">RS {amount}</Label>
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      value="partial"
                      checked={paymentType === "partial"}
                      onChange={() => {
                        setPaymentType("partial");
                        createPaymentLink(Number(amount) / 2);
                      }}
                    />
                    Partial Payment
                  </Label>
                  <Label className="text-red-700">
                    RS {Number(amount) / 2}
                  </Label>
                </div>
              )}

              <input
                type="text"
                placeholder="Enter Payment Link"
                className="w-full p-2 mb-2 rounded-md border"
                value={paymentLink}
                disabled
              />

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="confirmPaymentLink"
                  className="w-4 h-4"
                  checked={isCashInHand}
                  onChange={(e) => setIsCashInHand(e.target.checked)}
                />
                <Label htmlFor="confirmPaymentLink" className="text-sm text-gray-700">
                  Payment received from customer
                </Label>
              </div>

            </>
          )}
        </div>

        <div className="mb-4">
          <Label className="block mb-1 font-medium">Upload Document</Label>
          <FileInput onChange={handleDocument} />
        </div>

        <div className="text-right">
          <button
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={
              loading ||
              (statusType === "Payment request (partial/full)" &&
                (generatingPaymentLink || !paymentLink))
            }
          >
            {loading ||
              (statusType === "Payment request (partial/full)" &&
                generatingPaymentLink)
              ? "Processing..."
              : "Submit"}
          </button>
        </div>

        <Modal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          className="max-w-sm"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 mt-5 ml-9 text-gray-800 dark:text-white">
              Enter OTP
            </h2>

            {/* <div className="flex justify-center space-x-2 mb-4 mt-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-10 h-10 text-center border rounded-md"
                />
              ))}
            </div> */}
            <div className="flex justify-center space-x-2 mb-4 mt-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                    }
                  }}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  className="w-10 h-10 text-center border rounded-md"
                />
              ))}
            </div>


            {otpError && (
              <p className="text-red-500 text-sm text-center mb-2">
                {otpError}
              </p>
            )}
            {otpSuccess && (
              <p className="text-green-500 text-sm text-center mb-2">
                OTP verified successfully!
              </p>
            )}

            <div className="text-right">
              <button
                onClick={handleOtpVerify}
                disabled={verifyingOtp}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {verifyingOtp ? "Verifying..." : "Submit"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Modal>
  );
};

export default UpdateStatusModal;
