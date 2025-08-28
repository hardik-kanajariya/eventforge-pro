import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { PurchasedTicket } from '../lib/types';
import { Calendar, MapPin, Clock, User, Ticket as TicketIcon } from '@phosphor-icons/react';

interface TicketDownloadProps {
  ticket: PurchasedTicket;
  onClose: () => void;
}

export function TicketDownload({ ticket, onClose }: TicketDownloadProps) {
  const downloadTicketPDF = () => {
    // Create a printable ticket layout
    const ticketWindow = window.open('', '_blank');
    if (!ticketWindow) return;

    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event Ticket - ${ticket.eventDetails.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              background: #f8f9fa;
              padding: 20px;
            }
            .ticket {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              position: relative;
            }
            .ticket-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .event-title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .ticket-type {
              font-size: 16px;
              opacity: 0.9;
              background: rgba(255, 255, 255, 0.2);
              padding: 4px 12px;
              border-radius: 20px;
              display: inline-block;
            }
            .ticket-body {
              padding: 30px;
            }
            .ticket-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .info-item {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .info-icon {
              width: 20px;
              height: 20px;
              color: #667eea;
            }
            .info-label {
              font-weight: 600;
              color: #374151;
            }
            .info-value {
              color: #6b7280;
            }
            .barcode-section {
              background: #f9fafb;
              border: 2px dashed #d1d5db;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin-bottom: 20px;
            }
            .barcode {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              font-weight: bold;
              background: white;
              padding: 10px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              letter-spacing: 2px;
              margin: 10px 0;
            }
            .barcode-visual {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 60px;
              background: white;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              margin: 10px 0;
            }
            .barcode-lines {
              display: flex;
              height: 40px;
              align-items: end;
            }
            .bar {
              background: #000;
              margin: 0 1px;
            }
            .attendee-info {
              background: #f0f9ff;
              border: 1px solid #bae6fd;
              border-radius: 8px;
              padding: 20px;
            }
            .ticket-footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .terms {
              margin-top: 10px;
              font-size: 12px;
              line-height: 1.4;
            }
            @media print {
              body { background: white; padding: 0; }
              .ticket { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="ticket-header">
              <div class="event-title">${ticket.eventDetails.title}</div>
              <div class="ticket-type">${ticket.ticketDetails.name}</div>
            </div>
            
            <div class="ticket-body">
              <div class="ticket-info">
                <div class="info-item">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${new Date(ticket.eventDetails.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Time:</span>
                  <span class="info-value">${ticket.eventDetails.time}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Location:</span>
                  <span class="info-value">${ticket.eventDetails.location}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Organizer:</span>
                  <span class="info-value">${ticket.eventDetails.organizer}</span>
                </div>
              </div>
              
              <div class="attendee-info">
                <h3 style="margin-bottom: 10px; color: #1e40af;">Attendee Information</h3>
                <div class="info-item" style="margin-bottom: 8px;">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${ticket.attendeeName}</span>
                </div>
                <div class="info-item" style="margin-bottom: 8px;">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${ticket.attendeeEmail}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${ticket.attendeePhone}</span>
                </div>
              </div>
              
              <div class="barcode-section">
                <h3 style="margin-bottom: 10px; color: #374151;">Entry Barcode</h3>
                <div class="barcode-visual">
                  <div class="barcode-lines">
                    ${generateBarcodePattern(ticket.qrCode)}
                  </div>
                </div>
                <div class="barcode">${ticket.qrCode}</div>
                <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
                  Present this barcode at the event entrance for scanning
                </p>
              </div>
            </div>
            
            <div class="ticket-footer">
              <p><strong>Ticket ID:</strong> ${ticket.id}</p>
              <p><strong>Purchase Date:</strong> ${new Date(ticket.purchaseDate).toLocaleDateString()}</p>
              <div class="terms">
                <p><strong>Terms & Conditions:</strong></p>
                <p>• This ticket is non-transferable and non-refundable</p>
                <p>• Valid only for the specified event date and time</p>
                <p>• Must be presented with valid ID at entry</p>
                <p>• EventPro reserves the right to refuse entry</p>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    ticketWindow.document.write(ticketHTML);
    ticketWindow.document.close();
  };

  const generateBarcodePattern = (code: string): string => {
    // Generate a simple barcode pattern based on the QR code
    const patterns = [
      { width: 2, height: 30 },
      { width: 1, height: 40 },
      { width: 3, height: 25 },
      { width: 1, height: 35 },
      { width: 2, height: 30 },
      { width: 1, height: 40 },
      { width: 2, height: 25 },
      { width: 3, height: 35 },
    ];

    return code.split('').slice(0, 20).map((char, index) => {
      const pattern = patterns[index % patterns.length];
      const charCode = char.charCodeAt(0);
      const height = pattern.height + (charCode % 15);
      const width = pattern.width + (charCode % 2);
      
      return `<div class="bar" style="width: ${width}px; height: ${height}px;"></div>`;
    }).join('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Download Ticket</h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          {/* Ticket Preview */}
          <div className="border rounded-lg p-6 bg-gradient-to-br from-primary/5 to-accent/5 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">{ticket.eventDetails.title}</h3>
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                {ticket.ticketDetails.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ticket.eventDetails.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{ticket.eventDetails.time}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{ticket.eventDetails.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Attendee</p>
                    <p className="text-sm text-muted-foreground">{ticket.attendeeName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode Section */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TicketIcon className="w-6 h-6 text-primary mr-2" />
                <span className="font-medium">Entry Barcode</span>
              </div>
              
              {/* Simple barcode representation */}
              <div className="bg-white border border-gray-300 rounded p-3 mb-2">
                <div className="flex justify-center items-end h-12 space-x-1">
                  {ticket.qrCode.split('').slice(0, 15).map((char, index) => {
                    const height = 20 + (char.charCodeAt(0) % 30);
                    const width = 2 + (char.charCodeAt(0) % 2);
                    return (
                      <div 
                        key={index}
                        className="bg-black"
                        style={{ 
                          width: `${width}px`, 
                          height: `${height}px` 
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              
              <p className="font-mono text-sm font-bold">{ticket.qrCode}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Present this barcode at the event entrance
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={downloadTicketPDF} className="flex-1">
              Download PDF Ticket
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}