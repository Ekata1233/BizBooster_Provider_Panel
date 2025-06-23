'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InvoiceDownload() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    const originalDisplay = element.style.display;
    element.style.display = 'block';

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      element.style.display = originalDisplay;
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download Invoice
      </button>

      {/* Hidden invoice template */}
      <div
        ref={invoiceRef}
        style={{
          display: 'none',
          width: '794px',
          padding: '30px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          lineHeight: '1.2', // decreased line-height
          color: '#000',
          backgroundColor: '#fff',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Invoice</h2>
            <p style={{ margin: '4px 0' }}>Booking #100318</p>
            <p>Date: 20-Jun-2025 11:20pm</p>
          </div>
          <div style={{ textAlign: 'right', lineHeight: '1.4' }}>
            {/* Logo image added here */}
            <img
              src='../../../public/images/logo/final-logo.png'
              alt="Logo"
              style={{ width: '100px', marginBottom: '8px' }}
            />
            <p style={{ lineHeight: '1.4' }}>3rd Floor, 307 Amanora Chamber, Amanora Mall, Hadapsar Pune–411028</p>
            <p style={{ lineHeight: '1.4' }}>+91 93096 517500</p>
            <p style={{ lineHeight: '1.4' }}>info@bizbooster2x.com</p>
          </div>

        </div>

        {/* Box Section */}
        <div style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '20px', fontSize: '14px', lineHeight: '1.2' }}>
          {/* First Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ width: '30%' }}>
              <p><strong>Partner Info</strong></p>
              <p>Satish Kadam Kadam Test 1</p>
            </div>
            <div style={{ width: '20%' }}>
              <p><strong>Email</strong></p>
              <p>shivrajv@gmail.com</p>
            </div>
            <div style={{ width: '25%' }}>
              <p><strong>Phone</strong></p>
              <p>+91 93096 517900</p>
            </div>
            <div style={{ width: '25%' }}>
              <p><strong>Invoice of (INR)</strong></p>
              <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#007bff' }}>₹17,997.00</p>
            </div>
          </div>

          <hr style={{ margin: '16px 0' }} />

          {/* Second Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '33%' }}>
              <p><strong>Payment</strong></p>
              <p>Cash after service</p>
              <p><strong>Reference ID:</strong> 100318</p>
            </div>
            <div style={{ width: '33%' }}>
              <p><strong>Service Address</strong></p>
              <p>Satish Kadam Kadam Test 1</p>
              <p>+91 93095 17900</p>
              <p>FWJW+HRV, Gokul Colony, Papde Wasti, Phursungi, Pune, Maharashtra 412308, India</p>
            </div>
            <div style={{ width: '33%' }}>
              <p><strong>Service Time</strong></p>
              <p>Request Date: 20-Jun-2025 11:20pm</p>
              <p>Service Date: 20-Jun-2025 03:50am</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>SL</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Cost</th>
              <th style={thStyle}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>01</td>
              <td style={tdStyle}>
                <strong>App Marketing & Promotion</strong>
                <br />
                Basic-ASO-Package
              </td>
              <td style={tdStyle}>3</td>
              <td style={tdStyleRight}>₹5,999.00</td>
              <td style={tdStyleRight}>₹17,997.00</td>
            </tr>
          </tbody>
        </table>

        {/* Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <table style={{ width: '50%', fontSize: '13px' }}>
            <tbody>
              <tr><td>Subtotal</td><td style={rightAlign}>₹17,997.00</td></tr>
              <tr><td>Discount</td><td style={rightAlign}>- ₹0.00</td></tr>
              <tr><td>Campaign Discount</td><td style={rightAlign}>- ₹0.00</td></tr>
              <tr><td>Coupon Discount</td><td style={rightAlign}>- ₹0.00</td></tr>
              <tr><td>Referral Discount</td><td style={rightAlign}>- ₹0.00</td></tr>
              <tr><td>Vat / Tax (%)</td><td style={rightAlign}>+ ₹0.00</td></tr>
              <tr style={{ fontWeight: 'bold' }}>
                <td>Total</td><td style={rightAlign}>₹17,997.00</td>
              </tr>
              <tr style={{ fontWeight: 'bold', color: '#007bff' }}>
                <td>Due Amount</td><td style={rightAlign}>₹17,997.00</td>
              </tr>
            </tbody>
          </table>

          <div style={{ width: '100%', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            Thanks for using our service.
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <p><strong>Terms & Conditions</strong></p>
          <p>Change of mind is not applicable as a reason for refund</p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '40px',
          fontSize: '13px',
          color: '#555',
          gap: '20px',
          backgroundColor: '#f0f0f0',
          padding: '10px'
        }}>
          <span>bizbooster.lifelinecart.com</span>
          <span>+91 93096 517500</span>
          <span>info@bizbooster2x.com</span>
        </div>
      </div>
    </div>
  );
}

// Styles
const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left' as const,
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};

const tdStyleRight = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'right' as const,
};

const rightAlign = {
  textAlign: 'right' as const,
};
