import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTemplatesStore = defineStore("document", () => {
  const templates = ref([
    {
      id: 1,
      name: "Non Disclosure Agreement",
      author: "doclast",
      lastUpdate: "December 5, 2025",
      tags: ["nda", "legal", "confidential", "agreement"],
      status: "verified",
      type: "agreement",
      // Define the fields this template needs
      fields: [
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "disclosingPartyName",
          label: "Disclosing Party Name",
          type: "text",
          required: true,
        },
        {
          name: "disclosingPartyAddress",
          label: "Disclosing Party Address",
          type: "textarea",
          required: true,
        },
        {
          name: "disclosingPartyEmail",
          label: "Disclosing Party Email",
          type: "email",
          required: true,
        },
        {
          name: "receivingPartyName",
          label: "Receiving Party Name",
          type: "text",
          required: true,
        },
        {
          name: "receivingPartyAddress",
          label: "Receiving Party Address",
          type: "textarea",
          required: true,
        },
        {
          name: "receivingPartyEmail",
          label: "Receiving Party Email",
          type: "email",
          required: true,
        },
        {
          name: "purpose",
          label: "Purpose of Disclosure",
          type: "textarea",
          required: true,
          rows: 4,
        },
      ],
      content: `<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: 'Georgia', serif; line-height: 1.8; color: #1a1a1a;">
  <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 3px solid #2563eb; padding-bottom: 15px;">Non-Disclosure Agreement</h1>

  <p style="margin-bottom: 20px; text-align: justify;">This Non-Disclosure Agreement (the "Agreement") is entered into as of <strong>{{effectiveDate}}</strong> (the "Effective Date") by and between the following parties:</p>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); border-left: 5px solid #2563eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #1e40af;">DISCLOSING PARTY</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{disclosingPartyName}}</p>
    <p style="margin: 8px 0;"><strong>Address:</strong> {{disclosingPartyAddress}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{disclosingPartyEmail}}</p>
  </div>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%); border-left: 5px solid #10b981; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #047857;">RECEIVING PARTY</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{receivingPartyName}}</p>
    <p style="margin: 8px 0;"><strong>Address:</strong> {{receivingPartyAddress}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{receivingPartyEmail}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px;">1. PURPOSE</h2>
  <p style="margin-bottom: 20px; text-align: justify; padding: 15px; background-color: #f9fafb; border-radius: 6px;">{{purpose}}</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px;">2. CONFIDENTIAL INFORMATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The term "Confidential Information" means any and all information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or in any other form, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px;">3. OBLIGATIONS OF RECEIVING PARTY</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Receiving Party agrees to:</p>
  <ul style="margin-left: 25px; margin-bottom: 20px;">
    <li style="margin-bottom: 10px;">Hold and maintain the Confidential Information in strict confidence</li>
    <li style="margin-bottom: 10px;">Use the Confidential Information solely for the Purpose stated above</li>
    <li style="margin-bottom: 10px;">Not disclose the Confidential Information to any third parties without prior written consent</li>
    <li style="margin-bottom: 10px;">Protect the Confidential Information with the same degree of care used to protect its own confidential information</li>
  </ul>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px;">4. TERM</h2>
  <p style="margin-bottom: 16px; text-align: justify;">This Agreement shall remain in effect for a period of three (3) years from the Effective Date, unless earlier terminated by either party with thirty (30) days written notice.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px;">5. RETURN OF MATERIALS</h2>
  <p style="margin-bottom: 20px; text-align: justify;">Upon termination of this Agreement, the Receiving Party shall promptly return to the Disclosing Party all documents, materials, and other tangible items containing or representing Confidential Information and all copies thereof.</p>

  <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
      <div>
        <p style="margin-bottom: 30px;"><strong>DISCLOSING PARTY:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{disclosingPartyName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
      <div>
        <p style="margin-bottom: 30px;"><strong>RECEIVING PARTY:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{receivingPartyName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
    </div>
  </div>
</div>`,
    },
    {
      id: 2,
      name: "Employment Contract",
      author: "doclast",
      lastUpdate: "December 4, 2025",
      tags: ["employment", "contract", "legal"],
      status: "verified",
      type: "contract",
      fields: [
        {
          name: "effectiveDate",
          label: "Start Date",
          type: "date",
          required: true,
        },
        {
          name: "employerName",
          label: "Employer Name",
          type: "text",
          required: true,
        },
        {
          name: "employerEmail",
          label: "Employer Email",
          type: "email",
          required: true,
        },
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeEmail",
          label: "Employee Email",
          type: "email",
          required: true,
        },
        {
          name: "position",
          label: "Job Position/Title",
          type: "text",
          required: true,
        },
        {
          name: "salary",
          label: "Annual Salary",
          type: "text",
          required: true,
        },
        {
          name: "workLocation",
          label: "Work Location",
          type: "text",
          required: true,
        },
      ],
      content: `<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: 'Georgia', serif; line-height: 1.8; color: #1a1a1a;">
  <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 3px solid #7c3aed; padding-bottom: 15px;">Employment Contract</h1>

  <p style="margin-bottom: 20px; text-align: justify;">This Employment Contract (the "Agreement") is entered into as of <strong>{{effectiveDate}}</strong> (the "Start Date") by and between:</p>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); border-left: 5px solid #7c3aed; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #6b21a8;">EMPLOYER</h3>
    <p style="margin: 8px 0;"><strong>Company Name:</strong> {{employerName}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{employerEmail}}</p>
  </div>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%); border-left: 5px solid #f59e0b; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #92400e;">EMPLOYEE</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{employeeName}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{employeeEmail}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">1. POSITION AND DUTIES</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Employee is hired for the position of <strong>{{position}}</strong>. The Employee agrees to perform all duties and responsibilities associated with this position to the best of their ability.</p>
  <p style="margin-bottom: 16px; text-align: justify;"><strong>Work Location:</strong> {{workLocation}}</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">2. COMPENSATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Employee shall receive an annual salary of <strong>{{salary}}</strong>, payable in accordance with the Employer's standard payroll practices.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">3. WORKING HOURS</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Employee's normal working hours shall be forty (40) hours per week, Monday through Friday. The specific schedule may be adjusted by mutual agreement.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">4. BENEFITS</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Employee shall be entitled to participate in all benefit programs offered by the Employer, subject to the terms and conditions of such programs, including but not limited to:</p>
  <ul style="margin-left: 25px; margin-bottom: 20px;">
    <li style="margin-bottom: 10px;">Health insurance coverage</li>
    <li style="margin-bottom: 10px;">Paid time off and vacation days</li>
    <li style="margin-bottom: 10px;">Retirement plan contributions</li>
    <li style="margin-bottom: 10px;">Professional development opportunities</li>
  </ul>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">5. CONFIDENTIALITY</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Employee agrees to maintain the confidentiality of all proprietary information, trade secrets, and confidential data of the Employer during and after the term of employment.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">6. TERMINATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">Either party may terminate this Agreement with thirty (30) days written notice. The Employer may terminate this Agreement immediately for cause, including but not limited to misconduct, breach of duties, or violation of company policies.</p>

  <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
      <div>
        <p style="margin-bottom: 30px;"><strong>EMPLOYER:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{employerName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
      <div>
        <p style="margin-bottom: 30px;"><strong>EMPLOYEE:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{employeeName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
    </div>
  </div>
</div>`,
    },
    {
      id: 3,
      name: "Service Agreement",
      author: "doclast",
      lastUpdate: "December 3, 2025",
      tags: ["service", "agreement", "business"],
      status: "verified",
      type: "agreement",
      fields: [
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "providerName",
          label: "Service Provider Name",
          type: "text",
          required: true,
        },
        {
          name: "providerEmail",
          label: "Provider Email",
          type: "email",
          required: true,
        },
        {
          name: "clientName",
          label: "Client Name",
          type: "text",
          required: true,
        },
        {
          name: "clientEmail",
          label: "Client Email",
          type: "email",
          required: true,
        },
        {
          name: "serviceDescription",
          label: "Description of Services",
          type: "textarea",
          required: true,
          rows: 5,
        },
        {
          name: "serviceFee",
          label: "Service Fee",
          type: "text",
          required: true,
        },
      ],
      content: `<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: 'Georgia', serif; line-height: 1.8; color: #1a1a1a;">
  <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 3px solid #06b6d4; padding-bottom: 15px;">Service Agreement</h1>

  <p style="margin-bottom: 20px; text-align: justify;">This Service Agreement (the "Agreement") is entered into as of <strong>{{effectiveDate}}</strong> (the "Effective Date") by and between:</p>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #cffafe 0%, #f0fdfa 100%); border-left: 5px solid #06b6d4; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #0e7490;">SERVICE PROVIDER</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{providerName}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{providerEmail}}</p>
  </div>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%); border-left: 5px solid #ec4899; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #9f1239;">CLIENT</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{clientName}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{clientEmail}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #0e7490; border-bottom: 2px solid #a5f3fc; padding-bottom: 8px;">1. SERVICES</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Service Provider agrees to provide the following services to the Client:</p>
  <div style="padding: 15px; background-color: #f9fafb; border-radius: 6px; margin-bottom: 20px;">
    <p style="text-align: justify; white-space: pre-wrap;">{{serviceDescription}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #0e7490; border-bottom: 2px solid #a5f3fc; padding-bottom: 8px;">2. COMPENSATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">In consideration for the services provided, the Client agrees to pay the Service Provider a fee of <strong>{{serviceFee}}</strong>.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #0e7490; border-bottom: 2px solid #a5f3fc; padding-bottom: 8px;">3. PAYMENT TERMS</h2>
  <p style="margin-bottom: 16px; text-align: justify;">Payment shall be made according to the following terms:</p>
  <ul style="margin-left: 25px; margin-bottom: 20px;">
    <li style="margin-bottom: 10px;">Invoices will be submitted monthly or upon completion of milestones</li>
    <li style="margin-bottom: 10px;">Payment is due within thirty (30) days of invoice date</li>
    <li style="margin-bottom: 10px;">Late payments may incur a fee of 1.5% per month</li>
  </ul>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #0e7490; border-bottom: 2px solid #a5f3fc; padding-bottom: 8px;">4. TERM AND TERMINATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">This Agreement shall commence on the Effective Date and continue until the services are completed or until terminated by either party with thirty (30) days written notice.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #0e7490; border-bottom: 2px solid #a5f3fc; padding-bottom: 8px;">5. INDEPENDENT CONTRACTOR</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Service Provider is an independent contractor and not an employee of the Client. The Service Provider is responsible for all taxes, insurance, and other obligations arising from this independent contractor relationship.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #0e7490; border-bottom: 2px solid #a5f3fc; padding-bottom: 8px;">6. CONFIDENTIALITY</h2>
  <p style="margin-bottom: 16px; text-align: justify;">Both parties agree to maintain the confidentiality of any proprietary or confidential information disclosed during the course of this Agreement.</p>

  <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
      <div>
        <p style="margin-bottom: 30px;"><strong>SERVICE PROVIDER:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{providerName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
      <div>
        <p style="margin-bottom: 30px;"><strong>CLIENT:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{clientName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
    </div>
  </div>
</div>`,
    },
    {
      id: 4,
      name: "Partnership Agreement",
      author: "doclast",
      lastUpdate: "December 2, 2025",
      tags: ["partnership", "business", "legal"],
      status: "verified",
      type: "agreement",
      fields: [
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "partnershipName",
          label: "Partnership Name",
          type: "text",
          required: true,
        },
        {
          name: "partner1Name",
          label: "Partner 1 Name",
          type: "text",
          required: true,
        },
        {
          name: "partner1Email",
          label: "Partner 1 Email",
          type: "email",
          required: true,
        },
        {
          name: "partner1Contribution",
          label: "Partner 1 Capital Contribution",
          type: "text",
          required: true,
        },
        {
          name: "partner2Name",
          label: "Partner 2 Name",
          type: "text",
          required: true,
        },
        {
          name: "partner2Email",
          label: "Partner 2 Email",
          type: "email",
          required: true,
        },
        {
          name: "partner2Contribution",
          label: "Partner 2 Capital Contribution",
          type: "text",
          required: true,
        },
        {
          name: "businessPurpose",
          label: "Business Purpose",
          type: "textarea",
          required: true,
          rows: 4,
        },
      ],
      content: `<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: 'Georgia', serif; line-height: 1.8; color: #1a1a1a;">
  <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 3px solid #f59e0b; padding-bottom: 15px;">Partnership Agreement</h1>

  <p style="margin-bottom: 20px; text-align: justify;">This Partnership Agreement (the "Agreement") is entered into as of <strong>{{effectiveDate}}</strong> (the "Effective Date") to establish a partnership under the name:</p>

  <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%); border: 2px solid #f59e0b; border-radius: 8px; margin: 30px 0;">
    <h2 style="font-size: 24px; font-weight: bold; color: #92400e; margin: 0;">{{partnershipName}}</h2>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #92400e; border-bottom: 2px solid #fcd34d; padding-bottom: 8px;">1. PARTNERS</h2>
  
  <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%); border-left: 5px solid #3b82f6; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #1e40af;">PARTNER 1</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{partner1Name}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{partner1Email}}</p>
    <p style="margin: 8px 0;"><strong>Capital Contribution:</strong> {{partner1Contribution}}</p>
  </div>

  <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%); border-left: 5px solid #10b981; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #047857;">PARTNER 2</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{partner2Name}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{partner2Email}}</p>
    <p style="margin: 8px 0;"><strong>Capital Contribution:</strong> {{partner2Contribution}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #92400e; border-bottom: 2px solid #fcd34d; padding-bottom: 8px;">2. PURPOSE OF PARTNERSHIP</h2>
  <div style="padding: 15px; background-color: #f9fafb; border-radius: 6px; margin-bottom: 20px;">
    <p style="text-align: justify; white-space: pre-wrap;">{{businessPurpose}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #92400e; border-bottom: 2px solid #fcd34d; padding-bottom: 8px;">3. CAPITAL CONTRIBUTIONS</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The partners agree to contribute the following capital to the partnership:</p>
  <ul style="margin-left: 25px; margin-bottom: 20px;">
    <li style="margin-bottom: 10px;"><strong>{{partner1Name}}:</strong> {{partner1Contribution}}</li>
    <li style="margin-bottom: 10px;"><strong>{{partner2Name}}:</strong> {{partner2Contribution}}</li>
  </ul>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #92400e; border-bottom: 2px solid #fcd34d; padding-bottom: 8px;">4. PROFIT AND LOSS SHARING</h2>
  <p style="margin-bottom: 16px; text-align: justify;">Profits and losses shall be shared equally between the partners (50/50), unless otherwise agreed upon in writing.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #92400e; border-bottom: 2px solid #fcd34d; padding-bottom: 8px;">5. MANAGEMENT AND DECISION MAKING</h2>
  <p style="margin-bottom: 16px; text-align: justify;">All major business decisions shall require the unanimous consent of all partners. Day-to-day operational decisions may be made by any partner.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #92400e; border-bottom: 2px solid #fcd34d; padding-bottom: 8px;">6. DISSOLUTION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The partnership may be dissolved by mutual agreement of all partners or as otherwise provided by law. Upon dissolution, assets shall be liquidated and distributed according to each partner's capital account balance.</p>

  <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
      <div>
        <p style="margin-bottom: 30px;"><strong>PARTNER 1:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{partner1Name}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
      <div>
        <p style="margin-bottom: 30px;"><strong>PARTNER 2:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{partner2Name}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
    </div>
  </div>
</div>`,
    },
    {
      id: 5,
      name: "Consulting Agreement",
      author: "doclast",
      lastUpdate: "December 1, 2025",
      tags: ["consulting", "service", "agreement"],
      status: "verified",
      type: "agreement",
      fields: [
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "consultantName",
          label: "Consultant Name",
          type: "text",
          required: true,
        },
        {
          name: "consultantEmail",
          label: "Consultant Email",
          type: "email",
          required: true,
        },
        {
          name: "clientName",
          label: "Client Name",
          type: "text",
          required: true,
        },
        {
          name: "clientEmail",
          label: "Client Email",
          type: "email",
          required: true,
        },
        {
          name: "consultingServices",
          label: "Consulting Services Description",
          type: "textarea",
          required: true,
          rows: 5,
        },
        {
          name: "hourlyRate",
          label: "Hourly Rate or Project Fee",
          type: "text",
          required: true,
        },
        {
          name: "projectDuration",
          label: "Expected Project Duration",
          type: "text",
          required: true,
        },
      ],
      content: `<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: 'Georgia', serif; line-height: 1.8; color: #1a1a1a;">
  <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 3px solid #8b5cf6; padding-bottom: 15px;">Consulting Agreement</h1>

  <p style="margin-bottom: 20px; text-align: justify;">This Consulting Agreement (the "Agreement") is entered into as of <strong>{{effectiveDate}}</strong> (the "Effective Date") by and between:</p>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%); border-left: 5px solid #8b5cf6; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #6b21a8;">CONSULTANT</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{consultantName}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{consultantEmail}}</p>
  </div>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%); border-left: 5px solid #f97316; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #9a3412;">CLIENT</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{clientName}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{clientEmail}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">1. CONSULTING SERVICES</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Consultant agrees to provide the following consulting services to the Client:</p>
  <div style="padding: 15px; background-color: #f9fafb; border-radius: 6px; margin-bottom: 20px;">
    <p style="text-align: justify; white-space: pre-wrap;">{{consultingServices}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">2. COMPENSATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Client shall compensate the Consultant at a rate of <strong>{{hourlyRate}}</strong> for services rendered under this Agreement.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">3. TERM</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The expected duration of this consulting engagement is <strong>{{projectDuration}}</strong>, commencing on the Effective Date. This Agreement may be extended or terminated by mutual written agreement of both parties.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">4. PAYMENT TERMS</h2>
  <p style="margin-bottom: 16px; text-align: justify;">Payment terms are as follows:</p>
  <ul style="margin-left: 25px; margin-bottom: 20px;">
    <li style="margin-bottom: 10px;">Invoices will be submitted bi-weekly or monthly</li>
    <li style="margin-bottom: 10px;">Payment is due within thirty (30) days of invoice receipt</li>
    <li style="margin-bottom: 10px;">Late payments may incur interest charges at 1.5% per month</li>
  </ul>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">5. INDEPENDENT CONTRACTOR STATUS</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Consultant is engaged as an independent contractor and not as an employee. The Consultant is responsible for all applicable taxes, insurance, and other obligations arising from this independent contractor status.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">6. CONFIDENTIALITY AND INTELLECTUAL PROPERTY</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Consultant agrees to maintain strict confidentiality regarding all proprietary information and trade secrets of the Client. Any intellectual property developed during the course of this engagement shall be owned by the Client unless otherwise agreed in writing.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">7. TERMINATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">Either party may terminate this Agreement with thirty (30) days written notice. Upon termination, the Consultant shall be compensated for all work completed up to the termination date.</p>

  <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
      <div>
        <p style="margin-bottom: 30px;"><strong>CONSULTANT:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{consultantName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
      <div>
        <p style="margin-bottom: 30px;"><strong>CLIENT:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{clientName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
    </div>
  </div>
</div>`,
    },
  ]);

  const currentDocument = ref({
    details: {
      templateId: null,
      name: "",
      filename: "",
      description: "",
      status: "draft",
    },
    inputForms: [],
    preview: {
      content: "",
    },
    document: {
      selectedRecipientIds: [],
      sendToAlternativeEmail: false,
      alternativeEmail: "",
      sendToMyEmail: false,
    },
  });

  // Filters state
  const searchQuery = ref("");
  const statusFilter = ref("verified");
  const typeFilter = ref("all");
  const selectedTags = ref([]);

  const populatedDocumentContent = computed(() => {
    const template = getTemplateById(currentDocument.value.details.templateId);
    if (!template || !template.content) {
      console.warn("[Templates Store] No template found or no content");
      return "";
    }

    let content = template.content;
    console.log("[Templates Store] Populating template:", template.name);

    // Handle both data structures: { items: [...] } or direct array [...]
    const inputFormsData =
      currentDocument.value.inputForms?.items ||
      currentDocument.value.inputForms ||
      [];

    console.log("[Templates Store] Input forms data:", inputFormsData);

    // Get the first item's data for simple placeholders
    const firstItem =
      Array.isArray(inputFormsData) && inputFormsData.length > 0
        ? inputFormsData[0]
        : {};

    console.log("[Templates Store] First item data:", firstItem);

    // Replace all {{variable}} placeholders with actual values
    content = content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = firstItem[key];

      if (value !== undefined && value !== null && value !== "") {
        console.log(`[Templates Store] Replacing {{${key}}} with:`, value);
        return String(value);
      }

      console.warn(`[Templates Store] No value found for {{${key}}}`);
      return match; // Keep placeholder if no value
    });

    console.log("[Templates Store] Content population complete");
    return content;
  });

  const filteredTemplates = computed(() => {
    let result = templates.value;

    if (statusFilter.value !== "all") {
      result = result.filter((t) => t.status === statusFilter.value);
    }

    if (typeFilter.value !== "all") {
      result = result.filter((t) => t.type === typeFilter.value);
    }

    if (selectedTags.value.length > 0) {
      result = result.filter((template) => {
        return selectedTags.value.every((selectedTag) =>
          template.tags.some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
          )
        );
      });
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  });

  const allAvailableTags = computed(() => {
    const tagsSet = new Set();
    templates.value.forEach((template) => {
      template.tags.forEach((tag) => tagsSet.add(tag.toLowerCase()));
    });
    return Array.from(tagsSet).sort();
  });

  function getTemplateById(id) {
    return templates.value.find((t) => t.id === id);
  }

  function setSearchQuery(query) {
    searchQuery.value = query;
  }

  function setStatusFilter(status) {
    statusFilter.value = status;
  }

  function setTypeFilter(type) {
    typeFilter.value = type;
  }

  function addTag(tag) {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !selectedTags.value.includes(normalizedTag)) {
      selectedTags.value.push(normalizedTag);
    }
  }

  function removeTag(tag) {
    const index = selectedTags.value.findIndex(
      (t) => t.toLowerCase() === tag.toLowerCase()
    );
    if (index > -1) {
      selectedTags.value.splice(index, 1);
    }
  }

  function clearAllTags() {
    selectedTags.value = [];
  }

  function resetFilters() {
    searchQuery.value = "";
    statusFilter.value = "verified";
    typeFilter.value = "all";
    selectedTags.value = [];
  }

  function updateDetails(detailsData) {
    currentDocument.value.details = {
      ...currentDocument.value.details,
      ...JSON.parse(JSON.stringify(detailsData)),
    };
    console.log(
      "[Templates Store] Updated details:",
      currentDocument.value.details
    );
  }

  function updateInputForms(formsData) {
    // Handle both structures: { items: [...] } or direct [...]
    if (formsData?.items && Array.isArray(formsData.items)) {
      currentDocument.value.inputForms = JSON.parse(
        JSON.stringify(formsData.items)
      );
    } else if (Array.isArray(formsData)) {
      currentDocument.value.inputForms = JSON.parse(JSON.stringify(formsData));
    } else {
      currentDocument.value.inputForms = [];
    }

    console.log(
      "[Templates Store] Updated input forms:",
      currentDocument.value.inputForms
    );
  }

  function updatePreview(previewData) {
    currentDocument.value.preview = {
      ...currentDocument.value.preview,
      ...previewData,
    };
    console.log(
      "[Templates Store] Updated preview:",
      currentDocument.value.preview
    );
  }

  function updateDocument(documentData) {
    currentDocument.value.document = {
      ...currentDocument.value.document,
      ...documentData,
    };
    console.log(
      "[Templates Store] Updated document:",
      currentDocument.value.document
    );
  }

  function resetDocument() {
    currentDocument.value = {
      details: {
        templateId: null,
        name: "",
        filename: "",
        description: "",
        status: "draft",
      },
      inputForms: [],
      preview: {
        content: "",
      },
      document: {
        selectedRecipientIds: [],
        sendToAlternativeEmail: false,
        alternativeEmail: "",
        sendToMyEmail: false,
      },
    };
  }

  return {
    searchQuery,
    statusFilter,
    typeFilter,
    selectedTags,
    templates,
    currentDocument,
    filteredTemplates,
    allAvailableTags,
    populatedDocumentContent,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    addTag,
    removeTag,
    clearAllTags,
    resetFilters,
    getTemplateById,
    updateDetails,
    updateInputForms,
    updatePreview,
    updateDocument,
    resetDocument,
  };
});
