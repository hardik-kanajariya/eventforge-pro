import React from 'react';
import { Button } from './ui/button';
import { Calendar, MapPin, Clock,
interface TicketDownloadProps {
  onClose: () => void;

  const downloadTicketPDF = () 
    const ticketWindow = w

 

          <style>
            body { 
              background: #f8f9fa;
            }
              max-width: 600px

              box-shadow
              positio
            
              
              text-align: center;
            .even
              font-weight: bold;
            }
              font-size: 16px;
              background: rgba(255
              border-radius:
            }
              padding
            .ticket-info {
              grid-template-c
              margin-bottom: 30p
            .info-item {
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              position: relative;
             
            .ticket-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            .
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
              font-size: 12px;
            }
             
            }
        </head>
          <div class="ticke
              <div class="eve
            <
            <div class="t
                <div class="inf
                  <span class
             
                    day: 
                </div>
             
                </div>
                  <span class="inf
                </div>
                  <span class="in
                </div>
              
                <h3 style="margin-
             
                </div>
                  <span class="info-label">Email:</s
                </div>
                  <span class="i
                </div>
              
                <h3 style="margin-bottom
                  <div class="bar
                  </div>
                <div class="b
             
              </div>
            
              <p><strong>Ticket ID:</s
              <div class="terms">
                <p>• This t
                <p>• Must be pre
              </div>
          </div>
          <script>
             
          </script>
      </html>

    ticketWindow.document.close

    // Generate a 
      { width: 2, height: 30 },
      { width: 3, height: 25
      { width
      { width: 2, height: 25
    ];
    return code.split('').slice(0, 20).m
      const charCode = char.charC
      const width = pattern.
      return 
  };
  return (
      <Card className="max-w
          <div className="flex it
            <Button variant="
            </Button>

          <div class
              <h3 className="te
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
            {/
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

                  <div>
                    <p className="text-sm font-medium">Attendee</p>
                    <p className="text-sm text-muted-foreground">{ticket.attendeeName}</p>

                </div>

            </div>

            {/* Barcode Section */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TicketIcon className="w-6 h-6 text-primary mr-2" />
                <span className="font-medium">Entry Barcode</span>

              

              <div className="bg-white border border-gray-300 rounded p-3 mb-2">
                <div className="flex justify-center items-end h-12 space-x-1">
                  {ticket.qrCode.split('').slice(0, 15).map((char, index) => {
                    const height = 20 + (char.charCodeAt(0) % 30);
                    const width = 2 + (char.charCodeAt(0) % 2);

                      <div 

                        className="bg-black"

                          width: `${width}px`, 
                          height: `${height}px` 
                        }}

                    );

                </div>

              
              <p className="font-mono text-sm font-bold">{ticket.qrCode}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Present this barcode at the event entrance
              </p>
            </div>
          </div>

          <div className="flex space-x-4">

              Download PDF Ticket

            <Button variant="outline" onClick={onClose}>

            </Button>

        </div>

    </div>

}