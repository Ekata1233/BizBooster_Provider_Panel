'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InvoiceDownload() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    // Temporarily show the invoice if hidden
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      // Restore original display state
      element.style.display = originalDisplay;
    }
  };

  return (
    <div>

      <button  onClick={handleDownload}  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mx-2">
              Download Invoice
            </button>
      {/* <button onClick={handleDownload} className="btn btn-primary mb-4">
        Download PDF
      </button> */}

      {/* Hidden invoice template */}
      <div
        ref={invoiceRef}
        style={{
          padding: '40px',
          width: '794px',
          backgroundColor: 'white',
          color: '#333',
          fontFamily: 'Arial, sans-serif',
          display: 'none',
          boxSizing: 'border-box',
          margin: '0 auto',
          lineHeight: '1.4',
          fontSize: '14px'
        }}
      >
        {/* Header */}
        <h1 style={{ 
          margin: '0 0 5px 0', 
          fontSize: '20px',
          fontWeight: 'bold'
        }}>Invoice</h1>
        <p style={{ margin: '0 0 3px 0' }}>Booking #100318</p>
        <p style={{ margin: '0 0 20px 0' }}>Date: 20-Jun-2025 11:20pm</p>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#000',
          margin: '15px 0'
        }}></div>

        {/* Service Address */}
        <h2 style={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0 0 8px 0'
        }}>Service Address</h2>
        <p style={{ margin: '0 0 3px 0' }}>Sarah Kadam Kadam Test 1</p>
        <p style={{ margin: '0 0 3px 0' }}>+91809517800</p>
        <p style={{ margin: '0 0 20px 0' }}>
          PINWN-HRI, Golull Colony, Papde Vissil, Phursurgi, Pune, Maharashtra 412308, India
        </p>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#000',
          margin: '15px 0'
        }}></div>

        {/* Service Time */}
        <h2 style={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0 0 8px 0'
        }}>Service Time</h2>
        <p style={{ margin: '0 0 3px 0' }}>Request Date : 20-Jun-2025 11:20pm</p>
        <p style={{ margin: '0 0 20px 0' }}>Service Date : 20-Jun-2025 03:50am</p>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#000',
          margin: '15px 0'
        }}></div>

        {/* Items Table */}
        <table style={{ 
          width: '100%', 
          margin: '15px 0', 
          borderCollapse: 'collapse',
          border: '1px solid #000'
        }}>
          <thead>
            <tr>
              <th style={{ 
                padding: '8px', 
                textAlign: 'left', 
                border: '1px solid #000',
                fontWeight: 'bold'
              }}>SL</th>
              <th style={{ 
                padding: '8px', 
                textAlign: 'left', 
                border: '1px solid #000',
                fontWeight: 'bold'
              }}>Description</th>
              <th style={{ 
                padding: '8px', 
                textAlign: 'left', 
                border: '1px solid #000',
                fontWeight: 'bold'
              }}>City</th>
              <th style={{ 
                padding: '8px', 
                textAlign: 'right', 
                border: '1px solid #000',
                fontWeight: 'bold'
              }}>Cost</th>
              <th style={{ 
                padding: '8px', 
                textAlign: 'right', 
                border: '1px solid #000',
                fontWeight: 'bold'
              }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ 
                padding: '8px', 
                border: '1px solid #000'
              }}>01</td>
              <td style={{ 
                padding: '8px', 
                border: '1px solid #000'
              }}>App Marketing & Promotion Basic-ASD-Package</td>
              <td style={{ 
                padding: '8px', 
                border: '1px solid #000'
              }}>3</td>
              <td style={{ 
                padding: '8px', 
                textAlign: 'right', 
                border: '1px solid #000'
              }}>$5,999.00</td>
              <td style={{ 
                padding: '8px', 
                textAlign: 'right', 
                border: '1px solid #000'
              }}>$17,997.00</td>
            </tr>
          </tbody>
        </table>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#000',
          margin: '15px 0'
        }}></div>

        {/* Terms & Conditions */}
        <h2 style={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0 0 8px 0'
        }}>Terms & Conditions</h2>
        <p style={{ margin: '0 0 20px 0' }}>Change of mind is not applicable as a reason for refund</p>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#000',
          margin: '15px 0'
        }}></div>

        {/* Summary */}
        <h2 style={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0 0 8px 0'
        }}>Submit:</h2>
        <div style={{ marginLeft: '10px' }}>
          <p style={{ margin: '4px 0' }}>Subtotal</p>
          <p style={{ margin: '4px 0' }}>- Discount</p>
          <p style={{ margin: '4px 0' }}>- Campaign Discount</p>
          <p style={{ margin: '4px 0' }}>- Coupon Discount</p>
          <p style={{ margin: '4px 0' }}>- Referral Discount</p>
          <p style={{ margin: '4px 0' }}>- Val / Tax (%)</p>
          <p style={{ 
            margin: '8px 0 4px 0', 
            fontWeight: 'bold',
            fontSize: '15px'
          }}>Total</p>
          <p style={{ 
            margin: '4px 0', 
            fontWeight: 'bold',
            fontSize: '15px'
          }}>Due Amount</p>
        </div>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#000',
          margin: '15px 0'
        }}></div>

        {/* Footer Note */}
        <p style={{ margin: '15px 0' }}>Tasks for using our service.</p>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#000',
          margin: '15px 0'
        }}></div>

        {/* Total Amount */}
        <p style={{ 
          margin: '5px 0', 
          fontWeight: 'bold',
          fontSize: '15px'
        }}>Invoice of (NR)</p>
        <p style={{ 
          margin: '5px 0 20px 0', 
          fontWeight: 'bold', 
          fontSize: '18px'
        }}>$17,997.00</p>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#000',
          margin: '15px 0'
        }}></div>

        {/* Contact Info */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          fontSize: '13px'
        }}>
          <p style={{ margin: '4px 0' }}>bizbooster.lifelinecart.com</p>
          <p style={{ margin: '4px 0' }}>+919309517500</p>
          <p style={{ margin: '4px 0' }}>info@bizbooster2x.com</p>
        </div>
      </div>
    </div>
  );
}