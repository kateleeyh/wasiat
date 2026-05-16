# WasiatHub App Reference

Reference for rebuilding WasiatHub flows in another app.

Source files used:
- `WASIATHUB_PRD.md`
- `types/database.ts`
- `lib/formSteps.ts`
- `lib/validation.ts`
- `lib/crossValidation.ts`
- `components/forms/wasiat/steps/*`
- `components/forms/will/steps/*`
- `app/api/documents/save-step/route.ts`

## 1. Product Scope

WasiatHub is a Malaysian will-generation app for:

- **Wasiat**: Islamic will for Muslim users.
- **General Will / Surat Wasiat Am**: non-Muslim/general Malaysian will under the Wills Act 1959.

The product flow is:

1. User registers/logs in.
2. User chooses document type.
3. User fills a 7-step form.
4. Review page performs cross-field legal validation.
5. User pays or redeems bundle credit.
6. PDF is generated client-side and emailed.

Supported UI/document languages:

- UI supports Bahasa Malaysia and English.
- Wasiat document content is always Bahasa Malaysia.
- General Will document content follows selected document language, `ms` or `en`.

## 2. Core Legal Rules

### Wasiat

- For Muslim testators only.
- Governed by state Syariah rules in Malaysia.
- Wasiat may allocate up to **1/3 of the estate** to non-Faraid heirs.
- Remaining estate follows Faraid.
- User can choose **All Follows Faraid**, meaning no 1/3 beneficiaries are appointed.
- In data, `beneficiaries = []` means All Follows Faraid.
- `beneficiaries = null` means Step 4 has not been filled.
- Wasi/executor must be Muslim.
- Witnesses must be Muslim.
- Valid witness gender combinations:
  - 2 Muslim men, or
  - 1 Muslim man + 2 Muslim women.
- Witnesses must not be beneficiaries.

### General Will

- Governed by the Wills Act 1959, Malaysia.
- Testator must be 18 or older and of sound mind.
- Muslims are directed to the Wasiat flow.
- Religion dropdown excludes Islam.
- Requires 2 witnesses.
- Witnesses must not be beneficiaries or spouses of beneficiaries.
- Foreign beneficiaries and witnesses are supported with passport numbers.
- Guardianship is optional and only applies when the testator has minor children.

## 3. Routes

```text
/                          Landing page
/auth/login                Login
/auth/register             Register
/dashboard                 Dashboard home
/dashboard/documents       My Documents
/dashboard/create          Choose document type
/dashboard/profile         User profile
/dashboard/billing         Billing history
/wasiat/[id]/step/[n]      Wasiat steps 1-7
/will/[id]/step/[n]        General Will steps 1-7
/wasiat/[id]/review        Wasiat review and preview
/will/[id]/review          General Will review and preview
/payment/[id]              Payment page
/payment/[id]/success      Success and PDF download
/insights                  Articles
/privacy                   Privacy Policy
/terms                     Terms of Use
/disclaimer                Disclaimer
/contact                   Contact Us
/admin                     Admin CRM — Overview
/admin/users               Admin CRM — Users
/admin/documents           Admin CRM — Documents
/admin/payments            Admin CRM — Revenue
/admin/promos              Admin CRM — Promo Codes
```

## 4. Main Data Model

### Enums

```ts
type DocumentType = 'wasiat' | 'general_will'
type DocumentStatus = 'draft' | 'completed'
type PaymentStatus = 'pending' | 'paid' | 'failed'
type Locale = 'ms' | 'en'
type Gender = 'male' | 'female'
type MaritalStatus = 'single' | 'married' | 'widowed' | 'divorced'
type AssignmentType = 'specific_asset' | 'percentage'
```

### Tables

`users`

- `id`
- `email`
- `full_name`
- `ic_number`
- `phone`
- `language_preference`
- `created_at`
- `bundle_credits`

`documents`

- `id`
- `user_id`
- `type`: `wasiat` or `general_will`
- `status`: `draft` or `completed`
- `language`: `ms` or `en`
- `created_at`
- `updated_at`
- `paid_at`
- `pdf_url`

`wasiat_data`

- `document_id`
- `testator_info`
- `movable_assets`
- `immovable_assets`
- `beneficiaries`
- `executor`
- `backup_executor`
- `witnesses`
- `declaration`

`will_data`

- `document_id`
- `testator_info`
- `assets`
- `beneficiaries`
- `asset_distributions`
- `residual_estate_beneficiary`
- `guardianship`
- `executor`
- `backup_executor`
- `witnesses`
- `declaration`

`payments`

- `document_id`
- `user_id`
- `billplz_bill_id`
- `amount`
- `currency`
- `status`
- `paid_at`
- `plan`: `single`, `bundle`, or `credit`

## 5. Shared Validation Helpers

### IC Handling

- IC input is stored as digits only, max 12 digits.
- Display formatting uses `YYMMDD-SS-XXXX`.
- Valid IC requires:
  - exactly 12 digits,
  - valid month `01-12`,
  - valid day for month, using 29 days for February,
  - state code not `00`.
- DOB is auto-derived from first 6 IC digits.
- Year logic:
  - if `YY <= currentYear % 100`, treat as `20YY`,
  - otherwise treat as `19YY`.
- Gender is auto-derived from the final IC digit:
  - odd = male,
  - even = female.

### Passport Handling

- Passport is accepted in selected General Will fields.
- Valid passport:
  - 6-20 characters,
  - alphanumeric only,
  - spaces removed,
  - stored uppercase in most fields.

### Phone

Valid phone regex after removing spaces and hyphens:

```regex
^(\+?60|0)\d{8,10}$
```

Examples:

- `0123456789`
- `+60123456789`
- `60123456789`

### Email

Simple regex:

```regex
^[^\s@]+@[^\s@]+\.[^\s@]+$
```

### Name Normalization

- Most name fields are uppercased on input.
- Address fields are also uppercased on input.

### Gender Warning

Soft warning only:

- If name contains `bin`, inferred male.
- If name contains `binti` or `binte`, inferred female.
- If name-inferred gender conflicts with IC gender, show warning but allow progress.

### Faraid Relationship Warning

Wasiat beneficiaries trigger a warning if relationship contains Faraid heir terms, such as:

- BM: `anak`, `isteri`, `suami`, `ibu`, `bapa`, `datuk`, `nenek`, `cucu`, `adik`, `abang`, `kakak`
- EN: `son`, `daughter`, `child`, `wife`, `husband`, `spouse`, `mother`, `father`, `parent`, `brother`, `sister`

Warning: bequest to a Faraid heir is void unless all other Faraid heirs consent voluntarily after death.

## 6. Save API

Endpoint:

```http
POST /api/documents/save-step
```

Requires authenticated Supabase user.

Single-field payload:

```json
{
  "documentId": "uuid",
  "docType": "wasiat",
  "fieldKey": "testator_info",
  "data": {}
}
```

Multi-field payload:

```json
{
  "documentId": "uuid",
  "docType": "will",
  "fields": [
    { "fieldKey": "executor", "data": {} },
    { "fieldKey": "backup_executor", "data": null }
  ]
}
```

Allowed `wasiat` fields:

- `testator_info`
- `movable_assets`
- `immovable_assets`
- `beneficiaries`
- `executor`
- `backup_executor`
- `witnesses`
- `declaration`

Allowed `will` fields:

- `testator_info`
- `assets`
- `beneficiaries`
- `asset_distributions`
- `residual_estate_beneficiary`
- `guardianship`
- `executor`
- `backup_executor`
- `witnesses`
- `declaration`

Save restrictions:

- Document must belong to current user.
- Completed documents cannot be edited.
- Draft documents can be saved step-by-step.

## 7. Wasiat Form

Step definitions:

| Step | Field key | Label |
|---:|---|---|
| 1 | `testator_info` | Testator Info / Maklumat Pewasiat |
| 2 | `movable_assets` | Asset List / Senarai Harta |
| 3 | `immovable_assets` | Immovable Assets / Harta Tak Alih |
| 4 | `beneficiaries` | Beneficiaries / Penerima Manfaat |
| 5 | `executor`, `backup_executor` | Executor / Wasi |
| 6 | `witnesses` | Witnesses / Saksi |
| 7 | `declaration` | Declaration / Perisytiharan |

### Wasiat Step 1: Testator Info

Stored shape:

```ts
interface WasiatTestatorInfo {
  full_name: string
  ic_number: string
  dob: string
  gender: 'male' | 'female'
  marital_status: 'single' | 'married' | 'widowed' | 'divorced'
  address: string
  phone: string
  email: string
  religion_confirmed: boolean
  state: string
}
```

Initial default:

```json
{
  "full_name": "",
  "ic_number": "",
  "dob": "",
  "gender": "male",
  "marital_status": "single",
  "address": "",
  "phone": "",
  "email": "",
  "religion_confirmed": false,
  "state": ""
}
```

Fields:

- Full name, required, uppercase.
- IC number, required, Malaysian IC only.
- Date of birth, required, auto-filled from IC but editable.
- Gender, required, auto-filled from IC.
- Marital status, required.
- State of domicile, required.
- Full address, required, uppercase.
- Phone, required.
- Email, required.
- Religion confirmation, required checkbox confirming user is Muslim.

State dropdown:

- Johor
- Kedah
- Kelantan
- Melaka
- Negeri Sembilan
- Pahang
- Perak
- Perlis
- Pulau Pinang
- Sabah
- Sarawak
- Selangor
- Terengganu
- W.P. Kuala Lumpur
- W.P. Labuan
- W.P. Putrajaya

Validity:

- All required fields filled.
- IC valid.
- Phone valid.
- Email valid.
- `religion_confirmed === true`.

### Wasiat Step 2: Movable Assets

Stored shape:

```ts
interface AssetItem {
  type: string
  details: string
  amount: number
  meta?: Record<string, string>
}

interface WasiatMovableAssets {
  mode: 'itemised' | 'general' | 'none'
  items?: AssetItem[]
  general_note?: string
}
```

Modes:

- `itemised`: user lists movable assets one by one.
- `general`: user uses a standard general asset declaration.

Default:

```json
{
  "mode": "itemised",
  "items": [{ "type": "", "details": "", "amount": 0 }]
}
```

Movable asset type options:

- Akaun Bank / Bank Account
- KWSP / EPF
- Insurans / Takaful
- Pelaburan / Saham / Investment / Shares
- Kenderaan / Vehicle
- Barang Kemas / Emas / Jewellery / Gold
- Lain-lain / Other

Itemised item fields:

- `type`, required.
- `details`, required.
- `amount`, optional number, min 0, default 0.

General mode:

- `general_note`, required non-empty string.
- Default text covers all movable and immovable assets.
- If Step 2 mode is `general`, Step 3 is automatically covered.

Validity:

- Itemised: at least one item, every item has `type` and `details`.
- General: `general_note.trim().length > 0`.

### Wasiat Step 3: Immovable Assets

Stored shape:

```ts
interface WasiatImmovableAssets {
  mode: 'itemised' | 'general' | 'none'
  items?: AssetItem[]
  general_note?: string
}
```

Special logic:

- If Step 2 `movable_assets.mode === 'general'`, Step 3 auto-emits:

```json
{ "mode": "general" }
```

- In that case, Step 3 is valid and no extra input is required.

Itemised immovable asset type options:

- Rumah Kediaman / Residential Property
- Hartanah Komersial / Commercial Property
- Tanah / Land

Itemised fields:

- `type`, required.
- `details`, required. Should include address and title/lot number.
- `amount`, optional number, min 0, default 0.

Validity:

- General inherited from Step 2: always valid.
- Itemised: at least one item, every item has `type` and `details`.

### Wasiat Step 4: Beneficiaries

Stored shape:

```ts
interface WasiatBeneficiary {
  full_name: string
  ic_number: string
  relationship: string
  phone: string
  assignment_type: 'percentage' | 'specific_asset'
  percentage?: number
  specific_asset?: string
}
```

Modes:

- Designate 1/3 beneficiaries.
- All Follows Faraid.

All Follows Faraid:

```json
[]
```

This is valid and means the user appoints no 1/3 beneficiaries. Do not treat this as incomplete.

Default beneficiary:

```json
{
  "full_name": "",
  "ic_number": "",
  "relationship": "",
  "phone": "",
  "assignment_type": "percentage"
}
```

Beneficiary fields:

- Full name, required, uppercase.
- IC number, required, Malaysian IC only.
- Relationship, required.
- Phone, required.
- Assignment method, required:
  - `percentage`
  - `specific_asset`
- If `percentage`: percentage required, `1-100`.
- If `specific_asset`: free-text specific asset required.

Relationship options:

- Suami
- Isteri
- Anak Lelaki
- Anak Perempuan
- Anak Angkat
- Ibu
- Bapa
- Abang
- Kakak
- Adik Lelaki
- Adik Perempuan
- Datuk
- Nenek
- Cucu
- Bapa Saudara
- Ibu Saudara
- Sepupu
- Ipar Lelaki
- Ipar Perempuan
- Rakan
- Sahabat
- Rakan Sekerja
- Pertubuhan / Badan Amal
- Lain-lain, with custom text

Percentage logic:

- Percentages are percentages of the allowed 1/3 estate portion, not of the whole estate.
- Sum of all percentage beneficiaries must not exceed 100.
- Sum can be below 100.
- Specific asset assignments do not count into the percentage sum.

Validity:

- All Follows Faraid: valid.
- Otherwise:
  - at least one beneficiary,
  - all required fields valid,
  - percentage rows have `percentage > 0 && percentage <= 100`,
  - specific asset rows have non-empty `specific_asset`,
  - total percentage <= 100.

### Wasiat Step 5: Executor / Wasi

Stored shapes:

```ts
interface WasiatPrimaryExecutor {
  full_name: string
  ic_number: string
  relationship: string
  phone: string
  address: string
}

interface WasiatBackupExecutor {
  full_name: string
  ic_number: string
  relationship: string
  phone: string
}
```

Save behavior:

- Step 5 saves two columns:
  - `executor`
  - `backup_executor`
- If backup is not selected, `backup_executor = null`.

Primary Wasi fields:

- Full name, required, uppercase.
- IC number, required.
- Relationship, required.
- Phone, required.
- Full address, required, uppercase.

Backup Wasi:

- Optional toggle.
- If enabled:
  - Full name, required.
  - IC number, required.
  - Relationship, required.
  - Phone, required.
- No address is collected for backup Wasi.

Relationship options:

- Suami
- Isteri
- Anak Lelaki
- Anak Perempuan
- Anak Angkat
- Ibu
- Bapa
- Abang
- Kakak
- Adik Lelaki
- Adik Perempuan
- Datuk
- Nenek
- Cucu
- Bapa Saudara
- Ibu Saudara
- Sepupu
- Ipar Lelaki
- Ipar Perempuan
- Rakan Karib
- Sahabat
- Rakan Sekerja
- Lain-lain, with custom text

Validity:

- Primary complete and valid.
- Backup complete and valid if enabled.

Legal requirement shown to user:

- Wasi must be Muslim.
- Wasi may be male or female.
- Wasi must be adult, sane, trustworthy.

### Wasiat Step 6: Witnesses

Stored shape:

```ts
interface WasiatWitness {
  full_name: string
  ic_number: string
  address: string
}

interface WasiatWitnesses {
  witness_1: WasiatWitness
  witness_2: WasiatWitness
  witness_3?: WasiatWitness
}
```

Fields per witness:

- Full name, required, uppercase.
- IC number, required, Malaysian IC only.
- Full address, required, uppercase.

Witness 3:

- Optional UI button.
- Required by validation when gender combination is 1 male + 1 female.

Gender combination logic:

- Extract gender from valid IC.
- Valid if:
  - male count >= 2, or
  - male count >= 1 and female count >= 2.
- Invalid if:
  - 2 females only,
  - 1 male + 1 female without a third female,
  - no male.

Beneficiary conflict:

- Compare witness ICs against Step 4 beneficiary ICs.
- If a witness is a beneficiary, block progress.

Duplicate logic:

- Witnesses must have distinct ICs.
- Duplicate among witness 1, 2, and optional 3 blocks progress.

Validity:

- Witness 1 and 2 complete and valid.
- Witness 3 complete and valid if present.
- No duplicate IC.
- No witness is a beneficiary.
- Gender combination valid.

### Wasiat Step 7: Declaration

Stored shape:

```ts
interface WasiatDeclaration {
  date: string
  acknowledged: boolean
  personal_wishes?: string
}
```

Default:

```json
{
  "date": "today",
  "acknowledged": false,
  "personal_wishes": ""
}
```

Fields:

- Declaration date, required, max today.
- Personal wishes:
  - user can use preset text,
  - or write custom text.
- Acknowledgement checkbox, required.

Important:

- The Wasiat declaration preview and preset document wording are always in Bahasa Malaysia, regardless of UI language.
- If user chooses preset wishes, `personal_wishes` may be empty and PDF falls back to preset.

Validity:

- Date present.
- `acknowledged === true`.

## 8. General Will Form

Actual app step definitions:

| Step | Field key | Label |
|---:|---|---|
| 1 | `testator_info` | Testator Info / Maklumat Pewasiat |
| 2 | `executor`, `backup_executor` | Executor / Pelaksana |
| 3 | `assets` | Assets / Aset |
| 4 | `beneficiaries`, `asset_distributions`, `residual_estate_beneficiary` | Beneficiaries / Penerima Manfaat |
| 5 | `guardianship` | Guardianship / Penjagaan |
| 6 | `witnesses` | Witnesses / Saksi |
| 7 | `declaration` | Declaration / Perisytiharan |

### Will Step 1: Testator Info

Stored shape:

```ts
interface WillTestatorInfo {
  full_name: string
  ic_number: string
  dob: string
  gender: 'male' | 'female'
  marital_status: 'single' | 'married' | 'widowed' | 'divorced'
  nationality: string
  religion: string
  address: string
  phone: string
  email: string
}
```

Default:

```json
{
  "full_name": "",
  "ic_number": "",
  "dob": "",
  "gender": "male",
  "marital_status": "single",
  "nationality": "Malaysian",
  "religion": "",
  "address": "",
  "phone": "",
  "email": ""
}
```

Fields:

- Full name, required, uppercase.
- IC number, required, Malaysian IC only.
- Date of birth, required, auto-filled from IC.
- Gender, required, auto-filled from IC.
- Marital status, required.
- Nationality, required.
- Religion, required.
- Address, required, uppercase.
- Phone, required.
- Email, required.

Religion options when document language is BM:

- Kristian
- Buddha
- Hindu
- Tao
- Sikh
- Tiada Agama
- Lain-lain

Religion options when document language is EN:

- Christianity
- Buddhism
- Hinduism
- Taoism
- Sikhism
- No Religion
- Others

Islam is not an option. The UI warns Muslim users to use Islamic Wasiat instead.

Validity:

- All required fields present.
- IC, phone, and email valid.

### Will Step 2: Executor

Stored shapes:

```ts
interface WillPrimaryExecutor {
  full_name: string
  ic_number: string
  relationship: string
  phone: string
  address: string
}

interface WillBackupExecutor {
  full_name: string
  ic_number: string
  relationship: string
  phone: string
}
```

Save behavior:

- Step 2 saves two columns:
  - `executor`
  - `backup_executor`
- If backup is not selected, `backup_executor = null`.

Primary executor fields:

- Full name, required, uppercase.
- IC number, required.
- Relationship, required.
- Phone, required.
- Full address, required, uppercase.

Extra address rule:

- Primary executor address must be at least 20 trimmed characters.

Backup executor:

- Optional.
- If enabled:
  - Full name, required.
  - IC number, required.
  - Relationship, required.
  - Phone, required.
- No backup address is collected.

Executor legal notes:

- Executor can be male or female.
- No religion restriction under Wills Act 1959.
- Executor can also be a beneficiary.

Relationship options follow document language.

BM options include:

- Suami, Isteri, Anak Lelaki, Anak Perempuan, Anak Angkat, Ibu, Bapa, Abang, Kakak, Adik Lelaki, Adik Perempuan, Datuk, Nenek, Cucu, Bapa Saudara, Ibu Saudara, Sepupu, Ipar Lelaki, Ipar Perempuan, Rakan Karib, Sahabat, Rakan Sekerja.

EN options include:

- Spouse, Son, Daughter, Adopted Child, Mother, Father, Brother, Sister, Grandfather, Grandmother, Grandchild, Uncle, Aunt, Cousin, Brother-in-law, Sister-in-law, Father-in-law, Mother-in-law, Partner, Friend, Close Friend, Colleague, Charity / Organisation.

### Will Step 3: Assets

Stored shape:

```ts
interface WillAssetCategory {
  category: string
  items: AssetItem[]
  note?: string
}

interface WillAssets {
  mode: 'itemised' | 'general'
  categories?: WillAssetCategory[]
  general_note?: string
}
```

Modes:

- `general`: recommended. A general property clause covers all property.
- `itemised`: user lists categories and individual assets.

General mode:

- Valid immediately.
- Optional `general_note`.
- Default clause gives all property not otherwise specifically disposed of to beneficiaries named in Step 4.
- Shows warning that EPF and insurance/takaful with nominees pass outside the Will.

Itemised mode:

- User must add at least one category.
- Every active category must have at least one complete item.

Categories:

- `property`
- `bank`
- `epf`
- `investment`
- `insurance`
- `business`
- `digital`
- `vehicle`
- `other`

#### Property Item

Meta fields:

- `subtype`
- `address`
- `lot_geran`

Subtypes:

- Kediaman
- Komersial
- Perindustrian
- Tanah Pertanian
- Tanah Kosong

Required:

- `type`.
- For `Tanah Pertanian` or `Tanah Kosong`: `lot_geran`.
- For built property: `address`.

Details composition:

- Land: `lot_geran`.
- Built property: `address` plus optional `(lot_geran)`.

#### Bank Item

Meta fields:

- `bank`
- `account_no`

Required:

- Bank name.
- Account number.

Bank options:

- Maybank
- Maybank Islamic
- CIMB Bank
- CIMB Islamic
- Public Bank
- Public Islamic Bank
- RHB Bank
- RHB Islamic
- Hong Leong Bank
- Hong Leong Islamic Bank
- AmBank
- AmBank Islamic
- Bank Islam Malaysia
- Bank Muamalat Malaysia
- Alliance Bank
- Affin Bank
- Affin Islamic Bank
- OCBC Bank
- Standard Chartered
- HSBC Bank
- UOB Bank
- BSN
- Agrobank
- Bank Rakyat
- Lain-lain

#### EPF Item

Meta fields:

- `member_no`

Required:

- EPF member number.

Warning:

- EPF with nominee passes directly to nominee and not through Will.

#### Investment Item

Meta fields:

- `subtype`
- `institution`
- `ref_no`

Subtypes:

- Unit Amanah
- ASB/ASN
- Saham
- PRS
- Sukuk/Bon
- Emas
- Lain-lain

Required:

- Type.
- Institution or fund name.

Reference number is optional.

#### Insurance / Takaful Item

Meta fields:

- `subtype`
- `company`
- `policy_no`

Subtypes:

- Insurans Hayat
- Takaful
- Pelaburan Berkaitan Insurans
- Insurans Perubatan
- Insurans Am

Required:

- Type.
- Company.
- Policy number.

Warning:

- Insurance/takaful with nominee passes directly to nominee and not through Will.

#### Business Item

Meta fields:

- `subtype`
- `biz_name`
- `ssm_no`
- `share_pct`

Subtypes:

- Milikan Tunggal
- Perkongsian
- Sdn Bhd
- Bhd
- LLP

Required:

- Type.
- Business name.

Optional:

- SSM number.
- Ownership share percentage.

#### Digital Asset Item

Meta fields:

- `subtype`
- `platform`
- `access_location`

Subtypes:

- Cryptocurrency
- Dompet E
- Perniagaan Dalam Talian
- Domain/Laman Web
- NFT
- Akaun Media Sosial
- Lain-lain

Required:

- Type.
- Platform or exchange.
- Location of access details.

Important:

- Do not collect passwords, PINs, private keys, or seed phrases.
- Collect only where access instructions are stored, such as a separate letter or safe.

#### Vehicle Item

Meta fields:

- `subtype`
- `brand_model`
- `plate`

Subtypes:

- Kereta
- Motosikal
- MPV/SUV
- Lori/Van
- Bot/Kapal
- Lain-lain

Required:

- Type.
- Brand and model.
- Plate number.

Plate is uppercased.

#### Other Item

Meta fields:

- `description`

Required:

- Description.

`type` is set from the first 40 characters of description.

### Will Step 4: Beneficiaries

This step depends on Step 3 asset mode.

Stored shapes:

```ts
interface WillBeneficiary {
  full_name: string
  id_type?: 'ic' | 'passport'
  ic_number: string
  relationship: string
  phone: string
  address: string
  assignment_type: 'percentage' | 'specific_asset'
  percentage?: number
  specific_asset?: string
}

interface AssetDistributionBeneficiary {
  full_name: string
  id_type?: 'ic' | 'passport'
  ic_number: string
  relationship: string
  phone: string
  percentage: number
}

interface AssetDistribution {
  asset_key: string
  asset_label: string
  beneficiaries: AssetDistributionBeneficiary[]
}

interface ResidualEstateBeneficiary {
  full_name: string
  id_type?: 'ic' | 'passport'
  ic_number: string
  relationship: string
}
```

Save behavior:

- Step 4 saves three columns:
  - `beneficiaries`
  - `asset_distributions`
  - `residual_estate_beneficiary`

#### General Asset Mode Beneficiaries

User can:

- Pre-fill shares using Distribution Act 1958 guidance, or
- Fill manually.

Distribution Act pre-fill questions:

1. Do you have children?
2. Are either of your parents alive? This question is skipped if the testator is not married and has children.

Suggested shares:

| Scenario | Suggested beneficiaries |
|---|---|
| Married + children + parents alive | Spouse 25%, Child 50%, Parent 25% |
| Married + children + no parents | Spouse 33%, Child 67% |
| Married + no children + parents alive | Spouse 50%, Parent 50% |
| Married + no children + no parents | Spouse 100% |
| Not married + children | Child 100% |
| No spouse/children + parents alive | Parent 100% |
| No spouse/children/parents | Manual sibling entry |

Manual beneficiary fields:

- Full name, required, uppercase.
- ID type:
  - `ic`
  - `passport`
- IC/passport number, required.
- Relationship, required.
- Phone, required.
- Address, required, uppercase.
- Assignment method:
  - `percentage`
  - `specific_asset`
- If percentage: `1-100`.
- If specific asset: required free-text asset description.

Percentage logic:

- Sum of all percentage rows must not exceed 100.
- Sum may be below 100.

Validity:

- Stage must be actual form stage, not the pre-fill choice stage.
- At least one beneficiary.
- Every beneficiary complete.
- Total percentage <= 100.
- Residual beneficiary valid if enabled.

#### Itemised Asset Mode Beneficiaries

There are two internal sub-steps:

1. Beneficiary pool.
2. Asset assignment.

Pool member shape:

```ts
interface PoolMember {
  full_name: string
  id_type: 'ic' | 'passport'
  ic_number: string
  relationship: string
}
```

Pool fields:

- Full name, required, uppercase.
- ID type, required.
- IC/passport number, required.
- Relationship, required.

Pool validity:

- At least one pool member.
- Every pool member has name, valid ID/passport, and relationship.

Asset distribution creation:

- For each item listed in Step 3 itemised assets, create:

```json
{
  "asset_key": "catIdx-itemIdx",
  "asset_label": "category — item.details",
  "beneficiaries": []
}
```

Assignment logic:

- User checks pool members for each asset.
- Each checked beneficiary gets a percentage for that specific asset.
- Each asset must have at least one beneficiary.
- Percentages for each asset must total exactly 100.
- Every checked beneficiary percentage must be greater than 0.
- "Split equally" assigns `Math.floor(100 / count)` to each, with the remainder added to the first beneficiary.

Validity:

- User must reach the `assign` sub-step.
- Pool valid.
- Every asset distribution valid.
- Residual beneficiary valid if enabled.

#### Residual Estate Beneficiary

Shared by both General and Itemised modes.

Optional toggle.

If not selected:

- Remaining unassigned assets are distributed under the Distribution Act 1958.

If selected, collect:

- Full name, required, uppercase.
- ID type: IC or passport.
- IC/passport number, required.
- Relationship, required.

No phone or address is collected for residual beneficiary.

### Will Step 5: Guardianship

Stored shapes:

```ts
interface ChildInfo {
  full_name: string
  id_type?: 'ic' | 'birth_cert' | 'passport'
  ic_birth_cert: string
  dob: string
}

interface WillPrimaryGuardian {
  full_name: string
  ic_number: string
  relationship: string
  address: string
  phone: string
}

interface WillBackupGuardian {
  full_name: string
  ic_number: string
  relationship: string
  phone: string
}

interface Guardianship {
  has_minor_children: boolean
  children?: ChildInfo[]
  primary_guardian?: WillPrimaryGuardian
  backup_guardian?: WillBackupGuardian
}
```

If no minor children:

```json
{ "has_minor_children": false }
```

This is valid and step can be skipped.

If minor children:

Child fields:

- Full name, required, uppercase.
- Identity document type:
  - `ic`
  - `birth_cert`
  - `passport`
- IC / birth certificate / passport number, required.
- DOB, required.

Child IC logic:

- If ID type is `ic`, DOB is auto-derived from IC.
- Switching ID type clears ID and DOB.

Primary guardian fields:

- Full name, required, uppercase.
- IC number, required, Malaysian IC.
- Relationship, required.
- Phone, required.
- Address, required, uppercase.

Backup guardian:

- Optional.
- If enabled:
  - Full name, required.
  - IC number, required.
  - Relationship, required.
  - Phone, required.
- No address is collected for backup guardian.

Validity:

- If `has_minor_children === false`, valid.
- If true:
  - at least one complete child,
  - primary guardian complete,
  - backup guardian complete if enabled.

### Will Step 6: Witnesses

Stored shape:

```ts
interface WillWitness {
  full_name: string
  id_type?: 'ic' | 'passport'
  ic_number: string
  phone?: string
  email?: string
  address: string
}

interface WillWitnesses {
  witness_1: WillWitness
  witness_2: WillWitness
}
```

Fields per witness:

- Full name, required, uppercase.
- Identity document type:
  - `ic`
  - `passport`
- IC/passport number, required.
- Phone, optional.
- Email, optional.
- Full address, required, uppercase.

Important:

- There are always exactly 2 witnesses.
- No gender, religion, or nationality restriction.
- Passport accepted for foreign witnesses.
- Witnesses must not be beneficiaries.

Validation:

- Witness 1 complete.
- Witness 2 complete.
- Valid ID/passport for each.
- Witnesses have different IDs.
- Neither witness ID appears in beneficiaries.

### Will Step 7: Declaration

Stored shape:

```ts
interface WillDeclaration {
  date: string
  signature_name: string
  acknowledged: boolean
  special_wishes?: string
}
```

Default:

```json
{
  "date": "today",
  "signature_name": "testator full name if available",
  "acknowledged": false,
  "special_wishes": ""
}
```

Fields:

- Special wishes, optional.
- Declaration date, required, max today.
- Signature name, required, uppercase.
- Acknowledgement checkbox, required.

Validity:

- Date present.
- Signature name present.
- `acknowledged === true`.

## 9. Cross-Field Review Validation

Review validation returns issues:

```ts
interface ValidationIssue {
  severity: 'error' | 'warning'
  en: string
  ms: string
  step: number
}
```

Important implementation detail:

- Identity comparisons strip non-digits and compare when both normalized values have at least 6 characters.
- This works for Malaysian IC values.
- Passport cross-validation is partially handled in witness UI, but `lib/crossValidation.ts` mainly normalizes digits.

### Wasiat Review Errors

Payment is blocked when:

- Testator equals primary Wasi.
- Testator equals backup Wasi.
- Primary Wasi equals backup Wasi.
- Testator equals any beneficiary.
- Testator equals Witness 1 or Witness 2.
- Primary Wasi equals Witness 1 or Witness 2.
- Backup Wasi equals Witness 1 or Witness 2.
- Any beneficiary equals Witness 1, Witness 2, or Witness 3.
- Witness 1 equals Witness 2.

### Wasiat Review Warnings

Payment is allowed but warning shown when:

- Primary Wasi is also a beneficiary.

### General Will Review Errors

Payment is blocked when:

- Testator equals primary executor.
- Testator equals backup executor.
- Primary executor equals backup executor.
- Testator equals any beneficiary.
- Testator equals Witness 1 or Witness 2.
- Testator equals primary guardian.
- Testator equals backup guardian.
- Primary guardian equals backup guardian.
- Any beneficiary equals Witness 1 or Witness 2.
- Witness 1 equals Witness 2.

Beneficiary IDs include:

- `beneficiaries`
- beneficiaries inside `asset_distributions`
- `residual_estate_beneficiary`

### General Will Review Warnings

Payment is allowed but warning shown when:

- Primary executor is also Witness 1.
- Primary executor is also Witness 2.

## 10. Completion and Resume Logic

Each form has 7 steps.

Resume draft uses first missing step:

```ts
const incomplete = steps.find((s) => !data[s.fieldKey])
return incomplete?.step ?? 7
```

Important caveat:

- `beneficiaries = []` for Wasiat All Follows Faraid is truthy enough as saved data in JavaScript context when present, but if checking manually in another app, do not treat empty array as incomplete for Wasiat Step 4.

## 11. Pricing and Payment

Plans:

| Plan | Price | `amountSen` | DOKU amount sent | Meaning |
|---|---:|---:|---:|---|
| Single | RM 79 | 7900 | 79 | 1 document |
| Family Bundle | RM 129 | 12900 | 129 | 2 credits: current document plus 1 stored credit |
| Credit | RM 0 | 0 | — | Redeem stored bundle credit |

Test mode:

- `TEST_MODE = true` charges RM 1 (amountSen: 100, DOKU amount: 1).
- `TEST_MODE = false` uses live RM 79 / RM 129 pricing. Currently active.

Centralized in `lib/pricing.ts`. Never hardcode prices elsewhere.

Important: DOKU amounts are sent in whole MYR (not sen). Divide `amountSen` by 100 before sending.

Payment gateway: DOKU (formerly SenangPay Malaysia).

- Checkout: `POST https://api.doku.com/checkout/v1/payment`
- Response URL: `data.response.payment.url`
- Webhook: DOKU POSTs to `/api/payment/callback` with HMAC-SHA256 signature
- Configured in DOKU dashboard → Webhook section

Single flow:

```text
Review -> Pay -> DOKU checkout -> Payment
  -> DOKU webhook -> /api/payment/callback verifies HMAC
  -> document marked completed + payment record inserted
  -> DOKU redirects to /payment/[id]/success
  -> PaymentVerifying polls DB every 3s (max 60s)
  -> Success shown -> Generate PDF
```

Family bundle flow:

```text
Review -> Pay bundle -> webhook marks completed + adds 1 bundle credit -> Success -> Generate PDF
Future document -> Payment page -> Use credit -> mark completed -> Generate PDF
```

Security note:

- Success page does NOT auto-mark documents as completed.
- PaymentVerifying waits for webhook confirmation before showing success.
- Users who cancel without paying are redirected back after 60s timeout.
- Simulate Payment button has been removed — live payments only.

## 12. PDF and Email

Design decision:

- PDF generation is client-side using `@react-pdf/renderer`.
- This avoids Cloudflare Workers memory/runtime limits.

After payment/success:

- PDF can be downloaded.
- PDF is uploaded to Supabase Storage.
- PDF URL is stored on `documents.pdf_url`.
- PDF is emailed using Resend from `services@wasiathub.my`.

## 13. Implementation Notes for Another App

- Keep form payloads as JSON with snake_case keys.
- Treat each step as one JSONB field, except:
  - Wasiat Step 5 saves `executor` and `backup_executor`.
  - General Will Step 2 saves `executor` and `backup_executor`.
  - General Will Step 4 saves `beneficiaries`, `asset_distributions`, and `residual_estate_beneficiary`.
- Do not allow edits after document status becomes `completed`.
- Keep review validation separate from per-step validation.
- Per-step validation controls Next button.
- Review validation controls payment access.
- For legal UX, warnings should be visible but not blocking.
- Errors should block payment.
- Keep Muslim users out of General Will by excluding Islam in the religion dropdown and linking to the Wasiat flow.
- Always generate Wasiat PDF text in BM even if the UI is English.
- Never collect digital asset secrets such as passwords, PINs, seed phrases, or private keys.

