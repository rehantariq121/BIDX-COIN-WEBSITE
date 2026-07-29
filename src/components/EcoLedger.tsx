import {
  CaretDown,
  Camera,
  CheckCircle,
  Clock,
  MapPin,
  Plant,
  ShieldCheck,
  Wallet,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

/**
 * Illustrative records only. These demonstrate the shape of a traceable
 * contribution under the proposed model — they are not live chain data, and the
 * three deliberately sit at different stages of maturity so the trail shows
 * pending and scheduled states rather than only completed ones.
 */
const records = [
  {
    hash: "0x7a3f…c21b",
    amount: "120 BIDX",
    opened: "Mar 2024",
    region: "Faisalabad, Punjab",
    maturity: "24-month cycle complete",
    stages: [
      {
        id: "contribution",
        icon: Wallet,
        label: "Contribution recorded",
        value: "120 BIDX",
        status: "verified",
        detail:
          "An eligible transaction is written to chain and becomes the origin of this trail.",
        meta: [
          ["Block", "36,914,552"],
          ["Recorded", "18 Mar 2024"],
        ],
      },
      {
        id: "allocation",
        icon: ShieldCheck,
        label: "Allocation restricted",
        value: "36 BIDX → Plantation Fund",
        status: "verified",
        detail:
          "The 30% environmental share is separated from operations and liquidity before any campaign can draw on it.",
        meta: [
          ["Share", "30% of contribution"],
          ["Held", "Restricted treasury"],
        ],
      },
      {
        id: "campaign",
        icon: Plant,
        label: "Campaign approved",
        value: "PK-24-011",
        status: "verified",
        detail:
          "A vetted partner plants against a documented plan with an agreed species mix and site.",
        meta: [
          ["Partner", "Reviewed nursery co-op"],
          ["Species", "Dalbergia sissoo, Azadirachta indica"],
        ],
      },
      {
        id: "evidence",
        icon: Camera,
        label: "Evidence published",
        value: "31.42°N, 73.08°E",
        status: "verified",
        detail:
          "Receipts, dated field images and coordinates connect the spending to a specific site.",
        meta: [
          ["Field images", "14 dated captures"],
          ["Receipts", "Linked to campaign ledger"],
        ],
      },
    ],
    survival: [
      { month: 3, status: "verified", note: "28 of 30 seedlings established." },
      { month: 6, status: "verified", note: "Canopy forming; no replanting required." },
      { month: 12, status: "verified", note: "27 surviving after a dry season." },
      { month: 24, status: "verified", note: "27 surviving; cycle closed." },
    ],
  },
  {
    hash: "0x4e91…88da",
    amount: "480 BIDX",
    opened: "Nov 2024",
    region: "Islamabad Capital Territory",
    maturity: "12-month check in progress",
    stages: [
      {
        id: "contribution",
        icon: Wallet,
        label: "Contribution recorded",
        value: "480 BIDX",
        status: "verified",
        detail:
          "An eligible transaction is written to chain and becomes the origin of this trail.",
        meta: [
          ["Block", "43,207,880"],
          ["Recorded", "02 Nov 2024"],
        ],
      },
      {
        id: "allocation",
        icon: ShieldCheck,
        label: "Allocation restricted",
        value: "144 BIDX → Plantation Fund",
        status: "verified",
        detail:
          "The 30% environmental share is separated from operations and liquidity before any campaign can draw on it.",
        meta: [
          ["Share", "30% of contribution"],
          ["Held", "Restricted treasury"],
        ],
      },
      {
        id: "campaign",
        icon: Plant,
        label: "Campaign approved",
        value: "PK-24-037",
        status: "verified",
        detail:
          "A vetted partner plants against a documented plan with an agreed species mix and site.",
        meta: [
          ["Partner", "Reviewed nursery co-op"],
          ["Species", "Melia azedarach"],
        ],
      },
      {
        id: "evidence",
        icon: Camera,
        label: "Evidence published",
        value: "33.68°N, 73.04°E",
        status: "verified",
        detail:
          "Receipts, dated field images and coordinates connect the spending to a specific site.",
        meta: [
          ["Field images", "41 dated captures"],
          ["Receipts", "Linked to campaign ledger"],
        ],
      },
    ],
    survival: [
      { month: 3, status: "verified", note: "112 of 120 seedlings established." },
      { month: 6, status: "verified", note: "Thinning completed on schedule." },
      { month: 12, status: "pending", note: "Field visit booked; result not yet published." },
      { month: 24, status: "scheduled", note: "Falls due Nov 2026." },
    ],
  },
  {
    hash: "0xb206…1f7c",
    amount: "75 BIDX",
    opened: "Jun 2025",
    region: "Multan, Punjab",
    maturity: "Awaiting first survival check",
    stages: [
      {
        id: "contribution",
        icon: Wallet,
        label: "Contribution recorded",
        value: "75 BIDX",
        status: "verified",
        detail:
          "An eligible transaction is written to chain and becomes the origin of this trail.",
        meta: [
          ["Block", "51,660,314"],
          ["Recorded", "27 Jun 2025"],
        ],
      },
      {
        id: "allocation",
        icon: ShieldCheck,
        label: "Allocation restricted",
        value: "22.5 BIDX → Plantation Fund",
        status: "verified",
        detail:
          "The 30% environmental share is separated from operations and liquidity before any campaign can draw on it.",
        meta: [
          ["Share", "30% of contribution"],
          ["Held", "Restricted treasury"],
        ],
      },
      {
        id: "campaign",
        icon: Plant,
        label: "Campaign approved",
        value: "PK-25-004",
        status: "verified",
        detail:
          "A vetted partner plants against a documented plan with an agreed species mix and site.",
        meta: [
          ["Partner", "Reviewed nursery co-op"],
          ["Species", "Acacia nilotica"],
        ],
      },
      {
        id: "evidence",
        icon: Camera,
        label: "Evidence published",
        value: "30.18°N, 71.49°E",
        status: "pending",
        detail:
          "Planting is logged, but the dated image set is still being assembled for publication.",
        meta: [
          ["Field images", "Upload in progress"],
          ["Receipts", "Linked to campaign ledger"],
        ],
      },
    ],
    survival: [
      { month: 3, status: "pending", note: "Falls due Sep 2025." },
      { month: 6, status: "scheduled", note: "Falls due Dec 2025." },
      { month: 12, status: "scheduled", note: "Falls due Jun 2026." },
      { month: 24, status: "scheduled", note: "Falls due Jun 2027." },
    ],
  },
] as const;

type Status = "verified" | "pending" | "scheduled";

const statusLabel: Record<Status, string> = {
  verified: "Verified",
  pending: "Pending",
  scheduled: "Scheduled",
};

export function EcoLedger({ id }: { id?: string }) {
  const [activeRecord, setActiveRecord] = useState(0);
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [openCheck, setOpenCheck] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const record = records[activeRecord];

  const selectRecord = (index: number) => {
    setActiveRecord(index);
    setOpenStage(null);
    setOpenCheck(null);
  };

  return (
    <section id={id} className="content-section ledger-section">
      <div className="section-shell">
        <div className="ledger-heading">
          <p className="eyebrow">The eco-ledger</p>
          <h2>Trace a contribution end to end.</h2>
          <p>
            Pick a sample record and follow it from an on-chain transaction to a
            survival result in the field.
          </p>
        </div>

        <div className="ledger-shell glass-panel">
          <div
            className="ledger-picker"
            role="tablist"
            aria-label="Sample contribution records"
          >
            {records.map((item, index) => (
              <button
                type="button"
                key={item.hash}
                role="tab"
                id={`ledger-tab-${index}`}
                aria-selected={index === activeRecord}
                aria-controls="ledger-trail"
                className={`ledger-chip${index === activeRecord ? " is-active" : ""}`}
                onClick={() => selectRecord(index)}
              >
                <span className="ledger-chip-hash">{item.hash}</span>
                <span className="ledger-chip-amount">{item.amount}</span>
              </button>
            ))}
          </div>

          <div
            className="ledger-trail"
            id="ledger-trail"
            role="tabpanel"
            aria-labelledby={`ledger-tab-${activeRecord}`}
          >
            <div className="ledger-summary">
              <div>
                <span>Opened</span>
                <strong>{record.opened}</strong>
              </div>
              <div>
                <MapPin aria-hidden="true" weight="duotone" />
                <strong>{record.region}</strong>
              </div>
              <div>
                <Clock aria-hidden="true" weight="duotone" />
                <strong>{record.maturity}</strong>
              </div>
            </div>

            <ol className="ledger-stages">
              {record.stages.map((stage, index) => {
                const Icon = stage.icon;
                const isOpen = openStage === stage.id;
                return (
                  <motion.li
                    className="ledger-stage"
                    key={`${record.hash}-${stage.id}`}
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: reduceMotion ? 0 : index * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <button
                      type="button"
                      className="ledger-stage-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenStage(isOpen ? null : stage.id)}
                    >
                      <span className="ledger-stage-icon">
                        <Icon aria-hidden="true" weight="duotone" />
                      </span>
                      <span className="ledger-stage-copy">
                        <span className="ledger-stage-label">{stage.label}</span>
                        <span className="ledger-stage-value">{stage.value}</span>
                      </span>
                      <span
                        className={`ledger-badge ledger-badge-${stage.status}`}
                      >
                        {statusLabel[stage.status]}
                      </span>
                      <CaretDown
                        aria-hidden="true"
                        weight="bold"
                        className={`ledger-caret${isOpen ? " is-open" : ""}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="ledger-stage-body"
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p>{stage.detail}</p>
                          <dl>
                            {stage.meta.map(([key, value]) => (
                              <div key={key}>
                                <dt>{key}</dt>
                                <dd>{value}</dd>
                              </div>
                            ))}
                          </dl>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ol>

            <div className="ledger-survival">
              <div className="ledger-survival-head">
                <CheckCircle aria-hidden="true" weight="duotone" />
                <h3>Survival rechecked</h3>
              </div>
              <div className="ledger-checks">
                {record.survival.map((check) => {
                  const isOpen = openCheck === check.month;
                  return (
                    <button
                      type="button"
                      key={`${record.hash}-${check.month}`}
                      className={`ledger-check ledger-check-${check.status}${
                        isOpen ? " is-open" : ""
                      }`}
                      aria-expanded={isOpen}
                      onClick={() => setOpenCheck(isOpen ? null : check.month)}
                    >
                      <span className="ledger-check-month">{check.month} mo</span>
                      <span className="ledger-check-status">
                        {statusLabel[check.status]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {openCheck !== null && (
                  <motion.p
                    className="ledger-check-note"
                    key={`${record.hash}-${openCheck}`}
                    initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {
                      record.survival.find((c) => c.month === openCheck)?.note
                    }
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="ledger-disclaimer">
            Sample records shown for illustration. These are not live chain data.
            A seedling, a surviving tree, an estimated carbon impact and a
            certified carbon credit remain different outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
