// ============================================================
// WasiatHub — Database & Form Types
// All JSONB content uses snake_case throughout.
// Types mirror exactly what the form collects — no extra fields.
// ============================================================

// ─── Scalar enums ─────────────────────────────────────────────────────────────

export type DocumentType   = 'wasiat' | 'general_will'
export type DocumentStatus = 'draft' | 'completed'
export type PaymentStatus  = 'pending' | 'paid' | 'failed'
export type AssetMode      = 'itemised' | 'general' | 'none'
export type Locale         = 'ms' | 'en'
export type Gender         = 'male' | 'female'
export type MaritalStatus  = 'single' | 'married' | 'widowed' | 'divorced'
export type PropertyType   = 'residential' | 'commercial' | 'land'
export type AssignmentType = 'specific_asset' | 'percentage'

// ─── WASIAT — Step 1: Testator ────────────────────────────────────────────────
// Fields: name, ic, dob, gender, marital_status, address, phone, email,
//         religion_confirmed, state
// Stored as snapshot — independent of users table for PDF generation.

export interface WasiatTestatorInfo {
  full_name:           string
  ic_number:           string
  dob:                 string          // ISO date e.g. "1980-01-01"
  gender:              Gender
  marital_status:      MaritalStatus
  address:             string
  phone:               string
  email:               string
  religion_confirmed:  boolean         // must be true to proceed
  state:               string          // Syariah enactment state
}

// ─── WASIAT — Steps 2 & 3: Assets ────────────────────────────────────────────
// Each asset is a simple { type, details, amount } row.
// type  = category label e.g. "Akaun Bank", "Hartanah", "Kenderaan"
// details = free text describing the asset
// amount  = estimated value in RM

export interface AssetItem {
  type:    string                   // sub-type e.g. "Akaun Simpanan", "Kediaman", "Kereta"
  details: string                   // human-readable summary auto-composed from meta fields
  amount:  number                   // estimated value in RM
  meta?:   Record<string, string>   // structured form fields (bank name, plate no., etc.)
}

export interface WasiatMovableAssets {
  mode:          AssetMode       // 'itemised' = Lampiran A | 'general' = general paragraph
  items?:        AssetItem[]     // required if mode = 'itemised'
  general_note?: string          // optional note if mode = 'general'
}

export interface WasiatImmovableAssets {
  mode:          AssetMode
  items?:        AssetItem[]     // type = "Kediaman" | "Komersial" | "Tanah"
                                 // details = address + lot/title number
  general_note?: string
}

// ─── WASIAT — Step 4: Beneficiaries (1/3 rule) ───────────────────────────────
// Beneficiaries share the 1/3 pool. Sum of all percentages must not exceed 100.
// (100% here means 100% of the allowed 1/3 of the estate — not 100% of total estate)
// Each beneficiary gets either a percentage OR a specific named asset.

export interface WasiatBeneficiary {
  full_name:       string
  ic_number:       string
  relationship:    string
  phone:           string
  assignment_type: AssignmentType     // 'percentage' | 'specific_asset'
  percentage?:     number             // required if assignment_type = 'percentage'
                                      // e.g. 50 means 50% of the 1/3 pool
  specific_asset?: string             // required if assignment_type = 'specific_asset'
                                      // free text e.g. "Rumah di No. 10 Jalan Bahagia"
}

// ─── WASIAT — Step 5: Executor (Wasi) ────────────────────────────────────────
// Primary executor has full details. Backup executor is simpler (no address).
// Note: Wasi must be Muslim — enforced by legal disclaimer, not a form checkbox.

export interface WasiatPrimaryExecutor {
  full_name:    string
  ic_number:    string
  relationship: string
  phone:        string
  address:      string
}

export interface WasiatBackupExecutor {
  full_name:    string
  ic_number:    string
  relationship: string
  phone:        string
}

// ─── WASIAT — Step 6: Witnesses (Saksi) ──────────────────────────────────────
// Both witnesses must not be beneficiaries — enforced by validation, not stored.
// Note: Witnesses must be Muslim — legal requirement noted in disclaimer.

export interface WasiatWitness {
  full_name: string
  ic_number: string
  address:   string
}

export interface WasiatWitnesses {
  witness_1:  WasiatWitness
  witness_2:  WasiatWitness
  witness_3?: WasiatWitness   // optional — required when witness_1 or witness_2 is female
}

// ─── WASIAT — Step 7: Declaration ────────────────────────────────────────────

export interface WasiatDeclaration {
  date:             string    // ISO date
  acknowledged:     boolean
  personal_wishes?: string    // optional personal message / arahan khas (falls back to preset)
}

// ============================================================
// WASIAT — Full record shape (maps to wasiat_data table columns)
// ============================================================

export interface WasiatRecord {
  id:               string
  document_id:      string
  testator_info:    WasiatTestatorInfo | null         // Step 1
  movable_assets:   WasiatMovableAssets | null        // Step 2
  immovable_assets: WasiatImmovableAssets | null      // Step 3
  beneficiaries:    WasiatBeneficiary[] | null        // Step 4
  executor:         WasiatPrimaryExecutor | null      // Step 5
  backup_executor:  WasiatBackupExecutor | null       // Step 5
  witnesses:        WasiatWitnesses | null            // Step 6
  declaration:      WasiatDeclaration | null          // Step 7
  updated_at:       string
}

// ============================================================
// GENERAL WILL — Types
// ============================================================

// ─── WILL — Step 1: Testator ─────────────────────────────────────────────────
// Follows Wills Act 1959. Testator must be ≥ 18, of sound mind.

export interface WillTestatorInfo {
  full_name:      string
  ic_number:      string          // IC or passport number
  dob:            string          // ISO date
  gender:         Gender
  marital_status: MaritalStatus
  nationality:    string
  religion:       string
  address:        string
  phone:          string
  email:          string
}

// ─── WILL — Step 2: Assets ───────────────────────────────────────────────────
// Assets are grouped by category. Each category has its own item list.
// Uses same AssetItem { type, details, amount } structure for consistency.
// Category-specific extra fields are encoded in `details` as free text.

export interface WillAssetCategory {
  category:  string        // e.g. "Property", "Bank Account", "EPF", "Insurance"
  items:     AssetItem[]
  note?:     string        // e.g. EPF disclaimer, insurance nomination note
}

export interface WillAssets {
  mode:         'itemised' | 'general'   // 'general' = single statement covering all property
  categories?:  WillAssetCategory[]      // required if mode = 'itemised'
  general_note?: string                  // optional extra note if mode = 'general'
}

// ─── WILL — Step 3: Beneficiaries (general mode) ─────────────────────────────
// Each beneficiary gets either a percentage of estate or a specific named asset.

export interface WillBeneficiary {
  full_name:       string
  id_type?:        'ic' | 'passport'   // defaults to 'ic'
  ic_number:       string              // stores IC or passport number
  relationship:    string
  phone:           string
  address:         string
  assignment_type: AssignmentType
  percentage?:     number          // e.g. 50 = 50% share of estate
  specific_asset?: string          // free text e.g. "Property at No. 10, Jalan Bahagia"
}

// ─── WILL — Step 3: Asset Distributions (itemised mode) ──────────────────────
// Used when assets.mode = 'itemised'. Each listed asset gets its own beneficiary list.

export interface AssetDistributionBeneficiary {
  full_name:    string
  id_type?:     'ic' | 'passport'
  ic_number:    string
  relationship: string
  phone:        string
  percentage:   number   // % of THIS specific asset (all rows for one asset should sum to 100)
}

export interface AssetDistribution {
  asset_key:    string   // "catIdx-itemIdx" e.g. "0-0", "1-2"
  asset_label:  string   // human-readable e.g. "Residential Property — 45 Elitis Mentari..."
  beneficiaries: AssetDistributionBeneficiary[]
}

// Person who receives everything not specifically assigned
export interface ResidualEstateBeneficiary {
  full_name:    string
  id_type?:     'ic' | 'passport'
  ic_number:    string
  relationship: string
}

// ─── WILL — Step 4: Guardianship ─────────────────────────────────────────────
// Only applies if testator has minor children.
// Primary guardian: full details. Backup guardian: name, IC, relationship, phone.

export interface ChildInfo {
  full_name:     string
  id_type?:      'ic' | 'birth_cert' | 'passport'   // defaults to 'ic' for Malaysian child
  ic_birth_cert: string   // IC number, birth certificate number, or passport number
  dob:           string   // ISO date — auto-derived from IC when id_type === 'ic'
}

export interface WillPrimaryGuardian {
  full_name:    string
  ic_number:    string
  relationship: string
  address:      string
  phone:        string
}

export interface WillBackupGuardian {
  full_name:    string
  ic_number:    string
  relationship: string
  phone:        string
}

export interface Guardianship {
  has_minor_children: boolean
  children?:          ChildInfo[]
  primary_guardian?:  WillPrimaryGuardian
  backup_guardian?:   WillBackupGuardian
}

// ─── WILL — Step 5: Executor ─────────────────────────────────────────────────
// Primary executor: full details. Backup executor: name, IC, relationship, phone.

export interface WillPrimaryExecutor {
  full_name:    string
  ic_number:    string
  relationship: string
  phone:        string
  address:      string
}

export interface WillBackupExecutor {
  full_name:    string
  ic_number:    string
  relationship: string
  phone:        string
}

// ─── WILL — Step 6: Witnesses ────────────────────────────────────────────────
// Witnesses must not be beneficiaries or spouses of beneficiaries.

export interface WillWitness {
  full_name: string
  id_type?:  'ic' | 'passport'   // defaults to 'ic'
  ic_number: string              // stores IC or passport number
  phone?:    string
  email?:    string
  address:   string
}

export interface WillWitnesses {
  witness_1: WillWitness
  witness_2: WillWitness
}

// ─── WILL — Step 7: Declaration ──────────────────────────────────────────────

export interface WillDeclaration {
  date:            string
  signature_name:  string
  acknowledged:    boolean
  special_wishes?: string
}

// ============================================================
// GENERAL WILL — Full record shape (maps to will_data table columns)
// ============================================================

export interface WillRecord {
  id:                          string
  document_id:                 string
  testator_info:               WillTestatorInfo | null              // Step 1
  assets:                      WillAssets | null                    // Step 2
  beneficiaries:               WillBeneficiary[] | null             // Step 3 (general mode)
  asset_distributions:         AssetDistribution[] | null           // Step 3 (itemised mode)
  residual_estate_beneficiary: ResidualEstateBeneficiary | null     // Step 3
  guardianship:                Guardianship | null                  // Step 4
  executor:                    WillPrimaryExecutor | null           // Step 5
  backup_executor:             WillBackupExecutor | null            // Step 5
  witnesses:                   WillWitnesses | null                 // Step 6
  declaration:                 WillDeclaration | null               // Step 7
  updated_at:                  string
}

// ============================================================
// DB table row types
// ============================================================

export interface UserProfile {
  id:                  string
  email:               string
  full_name:           string | null
  ic_number:           string | null
  phone:               string | null
  dob:                 string | null
  gender:              Gender | null
  marital_status:      MaritalStatus | null
  address:             string | null
  language_preference: Locale
  created_at:          string
}

export interface Document {
  id:         string
  user_id:    string
  type:       DocumentType
  status:     DocumentStatus
  language:   Locale
  created_at: string
  updated_at: string
  paid_at:    string | null
  pdf_url:    string | null
}

export interface Payment {
  id:              string
  document_id:     string
  user_id:         string
  billplz_bill_id: string
  amount:          number
  currency:        string
  status:          PaymentStatus
  paid_at:         string | null
}

export interface DocumentWithStatus {
  id:              string
  user_id:         string
  type:            DocumentType
  status:          DocumentStatus
  language:        Locale
  pdf_url:         string | null
  paid_at:         string | null
  created_at:      string
  updated_at:      string
  payment_status:  PaymentStatus | null
  payment_amount:  number | null
  billplz_bill_id: string | null
}

// ============================================================
// Supabase Database type map
// ============================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile
        Insert: {
          id:                   string
          email:                string
          full_name?:           string | null
          ic_number?:           string | null
          phone?:               string | null
          dob?:                 string | null
          gender?:              Gender | null
          marital_status?:      MaritalStatus | null
          address?:             string | null
          language_preference?: Locale
        }
        Update: {
          email?:               string
          full_name?:           string | null
          ic_number?:           string | null
          phone?:               string | null
          dob?:                 string | null
          gender?:              Gender | null
          marital_status?:      MaritalStatus | null
          address?:             string | null
          language_preference?: Locale
        }
        Relationships: []
      }
      documents: {
        Row: Document
        Insert: {
          user_id:   string
          type:      DocumentType
          language?: Locale
          status?:   DocumentStatus
          pdf_url?:  string | null
          paid_at?:  string | null
        }
        Update: {
          status?:     DocumentStatus
          language?:   Locale
          pdf_url?:    string | null
          paid_at?:    string | null
          updated_at?: string
        }
        Relationships: []
      }
      wasiat_data: {
        Row: WasiatRecord
        Insert: {
          document_id:       string
          testator_info?:    WasiatRecord['testator_info']
          movable_assets?:   WasiatRecord['movable_assets']
          immovable_assets?: WasiatRecord['immovable_assets']
          beneficiaries?:    WasiatRecord['beneficiaries']
          executor?:         WasiatRecord['executor']
          backup_executor?:  WasiatRecord['backup_executor']
          witnesses?:        WasiatRecord['witnesses']
          declaration?:      WasiatRecord['declaration']
        }
        Update: {
          testator_info?:    WasiatRecord['testator_info']
          movable_assets?:   WasiatRecord['movable_assets']
          immovable_assets?: WasiatRecord['immovable_assets']
          beneficiaries?:    WasiatRecord['beneficiaries']
          executor?:         WasiatRecord['executor']
          backup_executor?:  WasiatRecord['backup_executor']
          witnesses?:        WasiatRecord['witnesses']
          declaration?:      WasiatRecord['declaration']
        }
        Relationships: []
      }
      will_data: {
        Row: WillRecord
        Insert: {
          document_id:                   string
          testator_info?:                WillRecord['testator_info']
          assets?:                       WillRecord['assets']
          beneficiaries?:                WillRecord['beneficiaries']
          residual_estate_beneficiary?:  WillRecord['residual_estate_beneficiary']
          guardianship?:                 WillRecord['guardianship']
          executor?:                     WillRecord['executor']
          backup_executor?:              WillRecord['backup_executor']
          witnesses?:                    WillRecord['witnesses']
          declaration?:                  WillRecord['declaration']
        }
        Update: {
          testator_info?:                WillRecord['testator_info']
          assets?:                       WillRecord['assets']
          beneficiaries?:                WillRecord['beneficiaries']
          residual_estate_beneficiary?:  WillRecord['residual_estate_beneficiary']
          guardianship?:                 WillRecord['guardianship']
          executor?:                     WillRecord['executor']
          backup_executor?:              WillRecord['backup_executor']
          witnesses?:                    WillRecord['witnesses']
          declaration?:                  WillRecord['declaration']
        }
        Relationships: []
      }
      payments: {
        Row: Payment
        Insert: {
          document_id:      string
          user_id:          string
          billplz_bill_id?: string
          amount:           number
          currency?:        string
          status?:          PaymentStatus
          paid_at?:         string | null
        }
        Update: {
          billplz_bill_id?: string
          status?:          PaymentStatus
          paid_at?:         string | null
        }
        Relationships: []
      }
    }
    Views: {
      documents_with_status: {
        Row: DocumentWithStatus
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: {
      document_type:   DocumentType
      document_status: DocumentStatus
      payment_status:  PaymentStatus
      locale_type:     Locale
      gender_type:     Gender
      marital_status:  MaritalStatus
    }
  }
}
