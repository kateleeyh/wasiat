// Step definitions for Wasiat and General Will forms.
// Used by the form shell to render step indicator, labels, and routing.

export interface StepDefinition {
  step:       number
  fieldKey:   string    // matches the column name in wasiat_data / will_data
  labelMs:    string    // Bahasa Malaysia label
  labelEn:    string    // English label
}

export const WASIAT_STEPS: StepDefinition[] = [
  { step: 1, fieldKey: 'testator_info',    labelMs: 'Maklumat Pewasiat',      labelEn: 'Testator Info' },
  { step: 2, fieldKey: 'movable_assets',   labelMs: 'Senarai Harta',          labelEn: 'Asset List' },
  { step: 3, fieldKey: 'immovable_assets', labelMs: 'Harta Tak Alih',         labelEn: 'Immovable Assets' },
  { step: 4, fieldKey: 'beneficiaries',    labelMs: 'Penerima Manfaat',        labelEn: 'Beneficiaries' },
  { step: 5, fieldKey: 'executor',         labelMs: 'Wasi (Pelaksana)',        labelEn: 'Executor' },
  { step: 6, fieldKey: 'witnesses',        labelMs: 'Saksi',                   labelEn: 'Witnesses' },
  { step: 7, fieldKey: 'declaration',      labelMs: 'Perisytiharan',           labelEn: 'Declaration' },
]

export const WILL_STEPS: StepDefinition[] = [
  { step: 1, fieldKey: 'testator_info',    labelMs: 'Maklumat Pewasiat',       labelEn: 'Testator Info' },
  { step: 2, fieldKey: 'executor',         labelMs: 'Pelaksana',               labelEn: 'Executor' },
  { step: 3, fieldKey: 'assets',           labelMs: 'Aset',                    labelEn: 'Assets' },
  { step: 4, fieldKey: 'beneficiaries',    labelMs: 'Penerima Manfaat',        labelEn: 'Beneficiaries' },
  { step: 5, fieldKey: 'guardianship',     labelMs: 'Penjagaan',               labelEn: 'Guardianship' },
  { step: 6, fieldKey: 'witnesses',        labelMs: 'Saksi',                   labelEn: 'Witnesses' },
  { step: 7, fieldKey: 'declaration',      labelMs: 'Perisytiharan',           labelEn: 'Declaration' },
]

export const TOTAL_STEPS = 7

// Returns the first step number that has no saved data — used for "resume draft"
export function getFirstIncompleteStep(
  data: Record<string, unknown>,
  steps: StepDefinition[]
): number {
  const incomplete = steps.find((s) => !data[s.fieldKey])
  return incomplete?.step ?? TOTAL_STEPS
}
