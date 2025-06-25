import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";


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
    formData.append("serviceMan", serviceManId ?? "");
    formData.append("service", serviceId ?? "");
    formData.append("amount", amount);

    const leadStatus: Record<string, unknown> = {
      statusType,
      description,
    };

    if (linkType === "zoom" && zoomLink.trim()) {
      leadStatus.zoomLink = zoomLink;
    }

    if (linkType === "payment") {
      if (paymentLink.trim()) leadStatus.paymentLink = paymentLink;
      if (paymentType) leadStatus.paymentType = paymentType;
    }


    formData.append("leads", JSON.stringify([leadStatus]));

    if (document) {
      formData.append("document", document);
    }

    console.log("Submitting Lead:", {
      checkoutId,
      serviceCustomerId,
      serviceManId,
      serviceId,
      amount,
      leadStatus, // contains paymentLink?
    });


    onSubmit(formData);

    // Optional: Reset form after submit
    setStatusType("");
    setDescription("");
    setLinkType("");
    setZoomLink("");
    setPaymentLink("");
    setPaymentType("");
    setDocument(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Update Status</h2>

        <div className="mb-4">
          <Label className="block mb-1 font-medium">Status Type</Label>
          <select
            className="w-full p-2 rounded-md border"
            value={statusType}
            onChange={(e) => setStatusType(e.target.value)}
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
          <Label className="block mb-1 font-medium">Add Link</Label>
          <div className="flex gap-4 mb-2">
            <Label className="flex items-center gap-2">
              <input
                type="radio"
                name="linkType"
                value="zoom"
                checked={linkType === "zoom"}
                onChange={() => setLinkType("zoom")}
              />
              Zoom Link
            </Label>
            <Label className="flex items-center gap-2">
              <input
                type="radio"
                name="linkType"
                value="payment"
                checked={linkType === "payment"}
                onChange={() => setLinkType("payment")}
              />
              Payment Link
            </Label>
            {/* <Label className="text-red-700">RS {amount}</Label> */}
          </div>

          {linkType === "zoom" && (
            <input
              type="text"
              placeholder="Enter Zoom Link"
              className="w-full p-2 rounded-md border"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
            />
          )}

         {linkType === "payment" && (
  <>
    <div className="flex gap-4">
      {/* Full Payment Option */}
      <Label className="flex items-center gap-2">
        <input
          type="radio"
          name="paymentType"
          value="full"
          checked={paymentType === "full"}
          onChange={async () => {
            setPaymentType("full");

            const res = await fetch("https://biz-booster.vercel.app/api/payment/generate-payment-link", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: Number(amount),
                customerId: serviceCustomerId,
                customerName: "Customer Name",
                customerEmail: "customer@example.com",
                customerPhone: "9999999999",
              }),
            });

            const data = await res.json();
            const cleanLink = (data.paymentLink || "").replace(/paymentpayment$/, "");
            setPaymentLink(cleanLink);
            console.log("Set payment link:", cleanLink);
          }}
        />
        Full Payment
      </Label>

      <Label className="text-red-700">RS {amount}</Label>

      {/* Partial Payment Option */}
      <Label className="flex items-center gap-2">
        <input
          type="radio"
          name="paymentType"
          value="partial"
          checked={paymentType === "partial"}
          onChange={async () => {
            setPaymentType("partial");

            const res = await fetch("https://biz-booster.vercel.app/api/payment/generate-payment-link", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: Number(amount) / 2,
                customerId: serviceCustomerId,
                customerName: "Customer Name",
                customerEmail: "customer@example.com",
                customerPhone: "9999999999",
              }),
            });

            const data = await res.json();
            const cleanLink = (data.paymentLink || "").replace(/paymentpayment$/, "");
            setPaymentLink(cleanLink);
            console.log("Set payment link:", cleanLink);
          }}
        />
        Partial Payment
      </Label>

      <Label className="text-red-700">RS {Number(amount) / 2}</Label>
    </div>

    {/* Preview Link Section */}
    {paymentLink && (
      <div className="text-sm mt-2">
        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Preview Payment Link
        </a>
      </div>
    )}

    {/* Disabled Input Showing Link */}
    <input
      type="text"
      placeholder="Enter Payment Link"
      className="w-full p-2 mb-2 rounded-md border"
      value={paymentLink}
      disabled
    />
  </>
)}


        </div>

        <div className="mb-4">
          <Label className="block mb-1 font-medium">Upload Document</Label>
          <FileInput onChange={handleDocument} />
        </div>

        <div className="text-right">
          <button
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateStatusModal;
