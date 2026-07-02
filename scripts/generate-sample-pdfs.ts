import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import fs from 'fs'
import path from 'path'
import { WasiatPdf } from '../lib/pdf/WasiatPdf'
import { WillPdf } from '../lib/pdf/WillPdf'
import type { WasiatRecord, WillRecord } from '../types/database'

// ─── Sample: Wasiat Islam ─────────────────────────────────────────────────────

const sampleWasiat: WasiatRecord = {
  id: 'sample-wasiat-001',
  document_id: 'sample-wasiat-001',
  updated_at: new Date().toISOString(),
  testator_info: {
    full_name:          'Ahmad bin Abdullah',
    ic_number:          '780101-14-5678',
    dob:                '1978-01-01',
    gender:             'male',
    marital_status:     'married',
    address:            'No. 10, Jalan Bahagia 1, Taman Sejahtera, 68000 Ampang, Selangor',
    phone:              '012-3456789',
    email:              'ahmad@example.com',
    religion_confirmed: true,
    state:              'Selangor',
  },
  movable_assets: {
    mode: 'itemised',
    items: [
      { type: 'Akaun Bank', details: 'Akaun Simpanan Maybank — No. Akaun: 1234-5678-9012 (Cawangan Ampang)', amount: 45000 },
      { type: 'Kenderaan', details: 'Proton Saga 1.3 (2020) — No. Pendaftaran: WXY 1234', amount: 18000 },
      { type: 'Simpanan KWSP', details: 'Kumpulan Wang Simpanan Pekerja (KWSP) — No. Ahli: 12345678', amount: 120000 },
    ],
  },
  immovable_assets: {
    mode: 'itemised',
    items: [
      { type: 'Kediaman', details: 'Rumah Teres Dua Tingkat — No. 10, Jalan Bahagia 1, Taman Sejahtera, 68000 Ampang, Selangor. No. Geran: GM 12345, Lot 678', amount: 420000 },
    ],
  },
  beneficiaries: [
    { full_name: 'Aminah binti Ibrahim',      ic_number: '800505-10-1234', relationship: 'Isteri',         phone: '013-9876543', assignment_type: 'percentage', percentage: 50 },
    { full_name: 'Luqmanul Hakim bin Ahmad',  ic_number: '050312-14-2345', relationship: 'Anak Lelaki',   phone: '011-2233445', assignment_type: 'percentage', percentage: 30 },
    { full_name: 'Nur Aina binti Ahmad',      ic_number: '080818-14-6789', relationship: 'Anak Perempuan', phone: '011-5566778', assignment_type: 'percentage', percentage: 20 },
  ],
  executor: {
    full_name:    'Zulkifli bin Abdullah',
    ic_number:    '750615-14-3456',
    relationship: 'Adik Beradik (Abang)',
    phone:        '019-1122334',
    address:      'No. 5, Jalan Damai, Taman Maju, 68100 Batu Caves, Selangor',
  },
  backup_executor: {
    full_name:    'Mohd Farid bin Hassan',
    ic_number:    '820310-10-5678',
    relationship: 'Rakan Karib',
    phone:        '016-7788990',
  },
  witnesses: {
    witness_1: { full_name: 'Ibrahim bin Ismail', ic_number: '760920-14-4321', address: 'No. 22, Jalan Kenanga, Taman Bunga, 68000 Ampang, Selangor' },
    witness_2: { full_name: 'Hafiz bin Othman',   ic_number: '831105-14-8765', address: 'No. 7, Jalan Melati, Taman Indah, 68000 Ampang, Selangor' },
  },
  declaration: {
    date:            new Date().toISOString().split('T')[0],
    acknowledged:    true,
    personal_wishes: 'Saya berpesan kepada ahli keluarga agar menjaga silaturrahim dan menunaikan solat jenazah serta berdoa untuk keampunan saya. Saya juga berhasrat agar harta yang ditinggalkan diurus dengan amanah dan penuh tanggungjawab.',
  },
}

// ─── Sample: Surat Wasiat Am ──────────────────────────────────────────────────

const sampleWill: WillRecord = {
  id: 'sample-will-001',
  document_id: 'sample-will-001',
  updated_at: new Date().toISOString(),
  testator_info: {
    full_name:      'David Tan Wei Ming',
    ic_number:      '750515-10-1234',
    dob:            '1975-05-15',
    gender:         'male',
    marital_status: 'married',
    nationality:    'Malaysian',
    religion:       'Buddhist',
    address:        'No. 45, Jalan Sri Hartamas 7, Sri Hartamas, 50480 Kuala Lumpur',
    phone:          '012-8887766',
    email:          'david.tan@example.com',
  },
  assets: {
    mode: 'itemised',
    categories: [
      {
        category: 'Hartanah / Property',
        items: [{ type: 'Residential', details: 'Double Storey Terrace House — No. 45, Jalan Sri Hartamas 7, Sri Hartamas, 50480 Kuala Lumpur. Grant No.: HS(D) 98765, PT 12345', amount: 820000 }],
      },
      {
        category: 'Akaun Bank / Bank Accounts',
        items: [
          { type: 'Savings Account', details: 'CIMB Bank Berhad — Account No.: 8012-3456-7890 (Sri Hartamas Branch)', amount: 85000 },
          { type: 'Fixed Deposit',   details: 'Public Bank Berhad — FD Account No.: 3124-5678-90 (12-month tenure)', amount: 60000 },
        ],
      },
      {
        category: 'KWSP / EPF',
        items: [{ type: 'EPF Savings', details: 'Kumpulan Wang Simpanan Pekerja (EPF) — Member No.: 20987654. Note: EPF nomination is separate from this Will.', amount: 310000 }],
      },
      {
        category: 'Insurans / Insurance',
        items: [{ type: 'Life Insurance', details: 'Great Eastern Life Assurance — Policy No.: GE-1234567 (Sum Assured: RM500,000). Note: Insurance payout is governed by nomination, not this Will.', amount: 500000 }],
      },
      {
        category: 'Kenderaan / Vehicle',
        items: [{ type: 'Motor Vehicle', details: 'Toyota Camry 2.5V (2022) — Registration No.: WA 5678 B', amount: 135000 }],
      },
    ],
  },
  beneficiaries: [
    { full_name: 'Jennifer Lim Siew Ling', ic_number: '780820-10-5678', relationship: 'Spouse',   phone: '017-3344556', address: 'No. 45, Jalan Sri Hartamas 7, 50480 KL', assignment_type: 'percentage', percentage: 50 },
    { full_name: 'Ethan Tan Wei Jian',     ic_number: '100430-10-2345', relationship: 'Son',      phone: '',            address: 'No. 45, Jalan Sri Hartamas 7, 50480 KL', assignment_type: 'percentage', percentage: 25 },
    { full_name: 'Sophia Tan Wei Lin',     ic_number: '120915-10-6789', relationship: 'Daughter', phone: '',            address: 'No. 45, Jalan Sri Hartamas 7, 50480 KL', assignment_type: 'percentage', percentage: 25 },
  ],
  asset_distributions: null,
  residual_estate_beneficiary: {
    full_name:    'Jennifer Lim Siew Ling',
    ic_number:    '780820-10-5678',
    relationship: 'Spouse',
  },
  guardianship: {
    has_minor_children: true,
    children: [
      { full_name: 'Ethan Tan Wei Jian', ic_birth_cert: '100430-10-2345', dob: '2010-04-30', id_type: 'ic' },
      { full_name: 'Sophia Tan Wei Lin', ic_birth_cert: '120915-10-6789', dob: '2012-09-15', id_type: 'ic' },
    ],
    primary_guardian: {
      full_name:    'Jennifer Lim Siew Ling',
      ic_number:    '780820-10-5678',
      relationship: 'Mother / Surviving Spouse',
      address:      'No. 45, Jalan Sri Hartamas 7, Sri Hartamas, 50480 Kuala Lumpur',
      phone:        '017-3344556',
    },
    backup_guardian: {
      full_name:    'Michael Tan Wei Liang',
      ic_number:    '720310-10-3456',
      relationship: 'Brother (Paternal Uncle)',
      phone:        '016-6677889',
    },
  },
  executor: {
    full_name:    'Michael Tan Wei Liang',
    ic_number:    '720310-10-3456',
    relationship: 'Brother',
    phone:        '016-6677889',
    address:      'No. 12, Jalan Duta Kiara, Mont Kiara, 50480 Kuala Lumpur',
  },
  backup_executor: {
    full_name:    'Jennifer Lim Siew Ling',
    ic_number:    '780820-10-5678',
    relationship: 'Spouse',
    phone:        '017-3344556',
  },
  witnesses: {
    witness_1: { full_name: 'Raymond Wong Chee Keong', ic_number: '770318-10-4567', phone: '012-5566778', email: 'raymond@example.com', address: 'No. 8, Jalan Kiara 5, Mont Kiara, 50480 Kuala Lumpur' },
    witness_2: { full_name: 'Susan Ng Bee Leng',        ic_number: '800625-10-7890', phone: '019-8877665', email: 'susan@example.com',   address: 'Unit 12-3, Residensi Hartamas, Jalan Sri Hartamas, 50480 Kuala Lumpur' },
  },
  declaration: {
    date:           new Date().toISOString().split('T')[0],
    signature_name: 'David Tan Wei Ming',
    acknowledged:   true,
    special_wishes: 'I wish for my personal belongings, books, and memorabilia to be distributed among my children as they see fit. I request that my family observe a simple funeral in accordance with Buddhist customs. I ask that funds from my estate be set aside to support my children\'s higher education.',
  },
}

// ─── Generate ─────────────────────────────────────────────────────────────────

async function main() {
  const outDir = path.join(process.cwd(), 'material_extra')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  console.log('Generating Wasiat Islam PDF...')
  const wasiatBuffer = await renderToBuffer(
    React.createElement(WasiatPdf, { data: sampleWasiat, docRef: 'SAMPLE-WST-2026', generatedAt: new Date().toISOString() }) as any
  )
  const wasiatPath = path.join(outDir, 'WasiatHub-Sample-Wasiat-Islam.pdf')
  fs.writeFileSync(wasiatPath, wasiatBuffer)
  console.log('✓ Saved:', wasiatPath)

  console.log('Generating General Will PDF...')
  const willBuffer = await renderToBuffer(
    React.createElement(WillPdf, { data: sampleWill, docRef: 'SAMPLE-WLL-2026', generatedAt: new Date().toISOString(), language: 'en' }) as any
  )
  const willPath = path.join(outDir, 'WasiatHub-Sample-General-Will.pdf')
  fs.writeFileSync(willPath, willBuffer)
  console.log('✓ Saved:', willPath)

  console.log('\nDone. PDFs saved to material_extra/')
}

main().catch(console.error)
