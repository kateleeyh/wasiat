// ─── Legal Rules Reference — General Will (Wills Act 1959) ───────────────────
//
//  Scenario                              | Legal?        | Enforced
//  --------------------------------------|---------------|---------------------------
//  Witness = named beneficiary           | Void gift     | Error (blocked)
//  Witness = residual estate beneficiary | Void gift     | Error (blocked)
//  Witness = spouse of beneficiary       | Void gift     | Warning (text only)
//  Witness = testator                    | Invalid will  | Error (blocked)
//  Witness = executor (not beneficiary)  | Allowed       | Warning (advisory only)
//  Two witnesses = same person           | Invalid will  | Error (blocked)
//  Executor = beneficiary                | Allowed       | Permitted
//  Executor = testator                   | Invalid       | Error (blocked)
//
// ─── Legal Rules Reference — Wasiat Islam (Syariah Enactments) ───────────────
//
//  Scenario                              | Legal?        | Enforced
//  --------------------------------------|---------------|---------------------------
//  Witness = beneficiary                 | Void gift     | Error (blocked)
//  Witness = testator                    | Invalid       | Error (blocked)
//  Wasi = witness                        | Discouraged   | Error (blocked, conservative)
//  Two witnesses = same person           | Invalid       | Error (blocked)
//  Wasi = beneficiary                    | Conflict risk | Warning (advisory)
//
// Source: Wills Act 1959 s.10, Distribution Act 1958, state Syariah enactments
// ─────────────────────────────────────────────────────────────────────────────

import type { WasiatRecord, WillRecord } from '@/types/database'

export interface ValidationIssue {
  severity: 'error' | 'warning'
  en: string
  ms: string
  step: number
}

function ic(s: string | undefined) {
  return s?.replace(/\D/g, '').trim() ?? ''
}

function conflict(a: string, b: string) {
  const x = ic(a); const y = ic(b)
  return x.length >= 6 && y.length >= 6 && x === y
}

// ─── WASIAT cross-validation ──────────────────────────────────────────────────

export function validateWasiat(d: WasiatRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const testatorIC     = ic(d.testator_info?.ic_number)
  const primaryWasiIC  = ic(d.executor?.ic_number)
  const backupWasiIC   = ic(d.backup_executor?.ic_number)
  const witness1IC     = ic(d.witnesses?.witness_1?.ic_number)
  const witness2IC     = ic(d.witnesses?.witness_2?.ic_number)
  const witness3IC     = ic(d.witnesses?.witness_3?.ic_number)
  const beneficiaryICs = (d.beneficiaries ?? []).map(b => ic(b.ic_number))

  // 1. Testator ≠ Primary Wasi
  if (testatorIC && primaryWasiIC && conflict(testatorIC, primaryWasiIC)) {
    issues.push({ severity: 'error', step: 5,
      en: 'Testator and primary executor (Wasi) cannot be the same person.',
      ms: 'Pewasiat dan Wasi Utama tidak boleh orang yang sama.',
    })
  }

  // 2. Testator ≠ Backup Wasi
  if (testatorIC && backupWasiIC && conflict(testatorIC, backupWasiIC)) {
    issues.push({ severity: 'error', step: 5,
      en: 'Testator and backup executor (Wasi) cannot be the same person.',
      ms: 'Pewasiat dan Wasi Sandaran tidak boleh orang yang sama.',
    })
  }

  // 3. Primary Wasi ≠ Backup Wasi
  if (primaryWasiIC && backupWasiIC && conflict(primaryWasiIC, backupWasiIC)) {
    issues.push({ severity: 'error', step: 5,
      en: 'Primary and backup executor (Wasi) cannot be the same person.',
      ms: 'Wasi Utama dan Wasi Sandaran tidak boleh orang yang sama.',
    })
  }

  // 4. Testator ≠ any Beneficiary
  beneficiaryICs.forEach((bIC, i) => {
    if (testatorIC && conflict(testatorIC, bIC)) {
      issues.push({ severity: 'error', step: 4,
        en: `Testator cannot be a beneficiary (beneficiary #${i + 1}).`,
        ms: `Pewasiat tidak boleh menjadi penerima manfaat (penerima #${i + 1}).`,
      })
    }
  })

  // 5. Testator ≠ Witnesses
  if (testatorIC && witness1IC && conflict(testatorIC, witness1IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Testator cannot be Witness 1.',
      ms: 'Pewasiat tidak boleh menjadi Saksi 1.',
    })
  }
  if (testatorIC && witness2IC && conflict(testatorIC, witness2IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Testator cannot be Witness 2.',
      ms: 'Pewasiat tidak boleh menjadi Saksi 2.',
    })
  }

  // 6. Wasi ≠ Witnesses (executor should not witness their own appointment)
  if (primaryWasiIC && witness1IC && conflict(primaryWasiIC, witness1IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Primary executor (Wasi) cannot be Witness 1.',
      ms: 'Wasi Utama tidak boleh menjadi Saksi 1.',
    })
  }
  if (primaryWasiIC && witness2IC && conflict(primaryWasiIC, witness2IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Primary executor (Wasi) cannot be Witness 2.',
      ms: 'Wasi Utama tidak boleh menjadi Saksi 2.',
    })
  }
  if (backupWasiIC && witness1IC && conflict(backupWasiIC, witness1IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Backup executor (Wasi) cannot be Witness 1.',
      ms: 'Wasi Sandaran tidak boleh menjadi Saksi 1.',
    })
  }
  if (backupWasiIC && witness2IC && conflict(backupWasiIC, witness2IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Backup executor (Wasi) cannot be Witness 2.',
      ms: 'Wasi Sandaran tidak boleh menjadi Saksi 2.',
    })
  }

  // 7. Beneficiary ≠ Witnesses (legally required under Syariah law)
  beneficiaryICs.forEach((bIC, i) => {
    if (bIC && witness1IC && conflict(bIC, witness1IC)) {
      issues.push({ severity: 'error', step: 6,
        en: `Beneficiary #${i + 1} cannot be Witness 1. A witness must not benefit from the Wasiat.`,
        ms: `Penerima manfaat #${i + 1} tidak boleh menjadi Saksi 1. Saksi tidak boleh mendapat manfaat dari wasiat.`,
      })
    }
    if (bIC && witness2IC && conflict(bIC, witness2IC)) {
      issues.push({ severity: 'error', step: 6,
        en: `Beneficiary #${i + 1} cannot be Witness 2. A witness must not benefit from the Wasiat.`,
        ms: `Penerima manfaat #${i + 1} tidak boleh menjadi Saksi 2. Saksi tidak boleh mendapat manfaat dari wasiat.`,
      })
    }
    if (bIC && witness3IC && conflict(bIC, witness3IC)) {
      issues.push({ severity: 'error', step: 6,
        en: `Beneficiary #${i + 1} cannot be Witness 3.`,
        ms: `Penerima manfaat #${i + 1} tidak boleh menjadi Saksi 3.`,
      })
    }
  })

  // 8. Witness 1 ≠ Witness 2
  if (witness1IC && witness2IC && conflict(witness1IC, witness2IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Witness 1 and Witness 2 cannot be the same person.',
      ms: 'Saksi 1 dan Saksi 2 tidak boleh orang yang sama.',
    })
  }

  // 9. Wasi ≠ Beneficiary (warning — not strictly illegal but inadvisable)
  beneficiaryICs.forEach((bIC, i) => {
    if (primaryWasiIC && conflict(primaryWasiIC, bIC)) {
      issues.push({ severity: 'warning', step: 5,
        en: `Primary executor (Wasi) is also beneficiary #${i + 1}. This is discouraged — the Wasi may have a conflict of interest.`,
        ms: `Wasi Utama juga adalah penerima manfaat #${i + 1}. Ini tidak digalakkan — Wasi mungkin mempunyai konflik kepentingan.`,
      })
    }
  })

  return issues
}

// ─── WILL cross-validation ────────────────────────────────────────────────────

export function validateWill(d: WillRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const testatorIC    = ic(d.testator_info?.ic_number)
  const primaryExecIC = ic(d.executor?.ic_number)
  const backupExecIC  = ic(d.backup_executor?.ic_number)
  const witness1IC    = ic(d.witnesses?.witness_1?.ic_number)
  const witness2IC    = ic(d.witnesses?.witness_2?.ic_number)
  const primaryGuardIC = ic(d.guardianship?.primary_guardian?.ic_number)
  const backupGuardIC  = ic(d.guardianship?.backup_guardian?.ic_number)

  const beneficiaryICs: string[] = [
    ...(d.beneficiaries ?? []).map(b => ic(b.ic_number)),
    ...(d.asset_distributions ?? []).flatMap(ad => ad.beneficiaries.map(b => ic(b.ic_number))),
  ]
  if (d.residual_estate_beneficiary?.ic_number) {
    beneficiaryICs.push(ic(d.residual_estate_beneficiary.ic_number))
  }

  // 1. Testator ≠ Executor
  if (testatorIC && primaryExecIC && conflict(testatorIC, primaryExecIC)) {
    issues.push({ severity: 'error', step: 5,
      en: 'Testator and primary executor cannot be the same person.',
      ms: 'Pewasiat dan Pelaksana Utama tidak boleh orang yang sama.',
    })
  }
  if (testatorIC && backupExecIC && conflict(testatorIC, backupExecIC)) {
    issues.push({ severity: 'error', step: 5,
      en: 'Testator and backup executor cannot be the same person.',
      ms: 'Pewasiat dan Pelaksana Sandaran tidak boleh orang yang sama.',
    })
  }

  // 2. Primary ≠ Backup Executor
  if (primaryExecIC && backupExecIC && conflict(primaryExecIC, backupExecIC)) {
    issues.push({ severity: 'error', step: 5,
      en: 'Primary and backup executor cannot be the same person.',
      ms: 'Pelaksana Utama dan Pelaksana Sandaran tidak boleh orang yang sama.',
    })
  }

  // 3. Testator ≠ any Beneficiary
  beneficiaryICs.forEach((bIC, i) => {
    if (testatorIC && conflict(testatorIC, bIC)) {
      issues.push({ severity: 'error', step: 3,
        en: `Testator cannot be a beneficiary (beneficiary #${i + 1}).`,
        ms: `Pewasiat tidak boleh menjadi penerima manfaat (penerima #${i + 1}).`,
      })
    }
  })

  // 4. Testator ≠ Witnesses
  if (testatorIC && witness1IC && conflict(testatorIC, witness1IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Testator cannot be Witness 1.',
      ms: 'Pewasiat tidak boleh menjadi Saksi 1.',
    })
  }
  if (testatorIC && witness2IC && conflict(testatorIC, witness2IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Testator cannot be Witness 2.',
      ms: 'Pewasiat tidak boleh menjadi Saksi 2.',
    })
  }

  // 5. Testator ≠ Guardian
  if (testatorIC && primaryGuardIC && conflict(testatorIC, primaryGuardIC)) {
    issues.push({ severity: 'error', step: 4,
      en: 'Testator cannot be the primary guardian.',
      ms: 'Pewasiat tidak boleh menjadi Penjaga Utama.',
    })
  }
  if (testatorIC && backupGuardIC && conflict(testatorIC, backupGuardIC)) {
    issues.push({ severity: 'error', step: 4,
      en: 'Testator cannot be the backup guardian.',
      ms: 'Pewasiat tidak boleh menjadi Penjaga Sandaran.',
    })
  }

  // 6. Primary ≠ Backup Guardian
  if (primaryGuardIC && backupGuardIC && conflict(primaryGuardIC, backupGuardIC)) {
    issues.push({ severity: 'error', step: 4,
      en: 'Primary and backup guardian cannot be the same person.',
      ms: 'Penjaga Utama dan Penjaga Sandaran tidak boleh orang yang sama.',
    })
  }

  // 7. Beneficiary ≠ Witnesses (Wills Act 1959 s.9 — will void for that witness)
  beneficiaryICs.forEach((bIC, i) => {
    if (bIC && witness1IC && conflict(bIC, witness1IC)) {
      issues.push({ severity: 'error', step: 6,
        en: `Beneficiary #${i + 1} cannot be Witness 1. Under the Wills Act 1959, a witness who is also a beneficiary forfeits their gift.`,
        ms: `Penerima manfaat #${i + 1} tidak boleh menjadi Saksi 1. Di bawah Akta Wasiat 1959, saksi yang juga penerima manfaat akan hilang haknya.`,
      })
    }
    if (bIC && witness2IC && conflict(bIC, witness2IC)) {
      issues.push({ severity: 'error', step: 6,
        en: `Beneficiary #${i + 1} cannot be Witness 2. Under the Wills Act 1959, a witness who is also a beneficiary forfeits their gift.`,
        ms: `Penerima manfaat #${i + 1} tidak boleh menjadi Saksi 2. Di bawah Akta Wasiat 1959, saksi yang juga penerima manfaat akan hilang haknya.`,
      })
    }
  })

  // 8. Witness 1 ≠ Witness 2
  if (witness1IC && witness2IC && conflict(witness1IC, witness2IC)) {
    issues.push({ severity: 'error', step: 6,
      en: 'Witness 1 and Witness 2 cannot be the same person.',
      ms: 'Saksi 1 dan Saksi 2 tidak boleh orang yang sama.',
    })
  }

  // 9. Executor = Witness — legally allowed under Wills Act 1959 (executor holds no gift),
  //    but advisable to use an independent witness to avoid any undue-influence challenge.
  if (primaryExecIC && witness1IC && conflict(primaryExecIC, witness1IC)) {
    issues.push({ severity: 'warning', step: 6,
      en: 'Primary executor is also Witness 1. This is legally permitted but using an independent witness is advisable to avoid any future challenge.',
      ms: 'Pelaksana Utama juga adalah Saksi 1. Ini dibenarkan undang-undang tetapi menggunakan saksi bebas adalah lebih elok untuk mengelakkan sebarang pertikaian.',
    })
  }
  if (primaryExecIC && witness2IC && conflict(primaryExecIC, witness2IC)) {
    issues.push({ severity: 'warning', step: 6,
      en: 'Primary executor is also Witness 2. This is legally permitted but using an independent witness is advisable to avoid any future challenge.',
      ms: 'Pelaksana Utama juga adalah Saksi 2. Ini dibenarkan undang-undang tetapi menggunakan saksi bebas adalah lebih elok untuk mengelakkan sebarang pertikaian.',
    })
  }

  return issues
}
