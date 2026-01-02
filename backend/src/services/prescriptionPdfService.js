const PDFDocument = require('pdfkit');

/**
 * Generate Prescription PDF
 * @param {Object} prescription - Prescription object
 * @returns {PDFDocument} PDF document stream
 */
function generatePrescriptionPDF(prescription) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Header - Clinic/Hospital Info
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .text(prescription.doctor.clinic_name, { align: 'center' })
     .moveDown(0.5);

  doc.fontSize(12)
     .font('Helvetica')
     .text(`Dr. ${prescription.doctor.name}`, { align: 'center' })
     .text(`Registration No: ${prescription.doctor.registration_no}`, { align: 'center' })
     .text(`${prescription.doctor.phone}`, { align: 'center' });

   if (prescription.doctor.email) {
    doc.text(`${prescription.doctor.email}`, { align: 'center' });
     }

  if (prescription.doctor.address) {
    doc.text(prescription.doctor.address, { align: 'center' });
  }

  // Horizontal line
  doc.moveDown(1)
     .moveTo(50, doc.y)
     .lineTo(550, doc.y)
     .stroke()
     .moveDown(1);

  // Date
  doc.fontSize(10)
     .text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, { align: 'right' })
     .moveDown(1);

  // Patient Information
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Patient Information', { underline: true })
     .moveDown(0.5);

  doc.fontSize(11)
     .font('Helvetica')
     .text(`Patient Name: ${prescription.patient.name}`)
     .text(`Baby ID: ${prescription.patient.baby_id}`)
     .text(`Age: ${prescription.patient.age_days} days`)
     .text(`Gender: ${prescription.patient.gender}`)
     .text(`Parent Contact: ${prescription.patient.parent_phone}`)
     .text(`Parent Email: ${prescription.patient.parent_email || 'Not provided'}`)
     .moveDown(1);

  // Diagnosis
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Diagnosis', { underline: true })
     .moveDown(0.5);

  doc.fontSize(11)
     .font('Helvetica')
     .text(prescription.diagnosis_summary, { align: 'justify' })
     .moveDown(1);

  // Medicines - Prescription Symbol
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('℞', { continued: true })
     .fontSize(14)
     .text('  Prescription', { underline: true })
     .moveDown(0.5);

  // Medicine List
  prescription.medicines.forEach((med, index) => {
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .text(`${index + 1}. ${med.name}`, { continued: false })
       .moveDown(0.3);

    doc.fontSize(10)
       .font('Helvetica')
       .text(`   Dosage: ${med.dosage}`, { indent: 20 })
       .text(`   Frequency: ${med.frequency}`, { indent: 20 })
       .text(`   Timing: ${med.timing.join(', ')}`, { indent: 20 })
       .text(`   Duration: ${med.duration}`, { indent: 20 });

    if (med.instructions) {
      doc.text(`   Instructions: ${med.instructions}`, { indent: 20 });
    }

    doc.moveDown(0.8);
  });

  // Advice Section
  if (prescription.advice) {
    doc.moveDown(0.5)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('Medical Advice', { underline: true })
       .moveDown(0.5);

    doc.fontSize(11)
       .font('Helvetica')
       .text(prescription.advice, { align: 'justify' })
       .moveDown(1);
  }

  // Footer - Doctor Signature
  doc.moveDown(2)
     .fontSize(10)
     .font('Helvetica')
     .text('_______________________', { align: 'right' })
     .moveDown(0.3)
     .text(`Dr. ${prescription.doctor.name}`, { align: 'right' })
     .text(`Reg. No: ${prescription.doctor.registration_no}`, { align: 'right' });

  // Disclaimer
  doc.moveDown(2)
     .fontSize(8)
     .font('Helvetica-Oblique')
     .text('This is a computer-generated prescription. Please follow the instructions carefully.', { align: 'center' })
     .text('For any queries, contact the clinic.', { align: 'center' });

  doc.end();

  return doc;
}

/**
 * Generate PDF Buffer (for email attachment)
 * @param {Object} prescription - Prescription object
 * @returns {Promise<Buffer>} PDF buffer
 */
function generatePrescriptionPDFBuffer(prescription) {
  return new Promise((resolve, reject) => {
    const doc = generatePrescriptionPDF(prescription);
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}

module.exports = {
  generatePrescriptionPDF,
  generatePrescriptionPDFBuffer
};